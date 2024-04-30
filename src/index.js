import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';
import { initialize } from "./cluster.js"
import { getMysqlConnection,closeMysqlConnection } from './db.js'
import cliProgress from 'cli-progress'
import { setTimeout } from 'node:timers/promises'

const ITEMS_PER_PAGE = 100
const CLUSTER_SIZE = 99
const DELAY_BETWEEN_QUERIES = 1000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TASK_FILE = path.join(__dirname, 'background-task.js');
dotenv.config();

async function* getAllPagedData(itemsPerPage, page = 0) {

    const pool = await getMysqlConnection();

    try {
        const [rows] = await pool.query('SELECT * FROM registers WHERE activated NOT IN (0, 3) LIMIT ? OFFSET ?', [itemsPerPage, page]);

        const items = rows;
        if (!items.length) return;

        yield items;

        yield* getAllPagedData(itemsPerPage, page += itemsPerPage);
    } finally {
        await closeMysqlConnection(pool);
    }
}

async function getTotalRegisters() {
	try {
			const pool = await getMysqlConnection();
			const [rows] = await pool.query(
					"SELECT COUNT(*) as total FROM registers where activated NOT IN (0, 3)"
			);
			return rows[0].total;
	} catch (error) {
			console.error('Erro ao obter o total de registros:', error);
			return 0;
	}
}

const total = await getTotalRegisters();
// console.log(`total items on DB: ${total}`)

const progress = new cliProgress.SingleBar({
    format: 'progress [{bar}] {percentage}% | {value}/{total} | {duration}s',
    clearOnComplete: false,
}, cliProgress.Presets.shades_classic);

progress.start(total, 0);
let totalProcessed = 0
const cp = initialize(
    {
        backgroundTaskFile: TASK_FILE,
        clusterSize: CLUSTER_SIZE,
        amountToBeProcessed: total,
        async onMessage(message) {
            progress.increment()

            if (++totalProcessed !== total) return
            progress.stop()
            cp.killAll()

            console.log(`total  ${totalProcessed} are processed`)
            process.exit()

        }
    }
)
async function processAllData() {
    let page = 0;

    for await (const data of getAllPagedData(ITEMS_PER_PAGE, page)) {
        cp.sendToChild(data);
        page += ITEMS_PER_PAGE;
        await setTimeout(DELAY_BETWEEN_QUERIES);
    }
}


await processAllData();