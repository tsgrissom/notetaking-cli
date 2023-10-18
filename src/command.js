import chalk from 'chalk'
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'
import { createNote, getAllNotes, removeNote, removeAllNotes, findNotes} from "./notes.js";
import {start} from "./server.js";

const listNotes = notes => {
    notes.forEach(({id, content, tags, created}) => {
        console.log('id: ', id)

        if (tags === undefined)
            console.log('tags: ', chalk.red('None'))
        else
            console.log('tags: ', tags)

        console.log('content: ', content)
        console.log('created: ', created)
        console.log('\n')
    })
}

yargs(hideBin(process.argv))
    .command('new <note>', 'Create a new note', yargs => {
        return yargs.positional('note', {
            type: 'string',
            description: 'The content of the note to create'
        })
    }, argv => {
        createNote(argv.note, argv.tags)
            .then(() => console.log(chalk.green('New note created')))
    })
    .option('tags', {
        alias: 't',
        type: 'string',
        description: 'tags to add to the note'
    })
    .command('ls', 'get all notes', () => {}, async argv => {
        const all = await getAllNotes()
        if (all.length === 0)
            console.log(chalk.red('There are no notes!'))
        else
            listNotes(all)
    })
    .command('find <filter>', "get matching notes", yargs => {
        return yargs.positional('filter', {
            describe: 'The search term to filter notes by, will be applied to content',
            type: 'string'
        })
    }, async argv => {
        const matches = await findNotes(argv.filter)
        listNotes(matches)
    })
    .command('rm <id>', 'remove a note by id', yargs => {
        return yargs.positional('id', {
            type: 'number',
            description: 'The id of the note you want to remove'
        })
    }, async (argv) => {
        removeNote(argv.id)
            .then(() => console.log(chalk.red(`Removed note #${argv.id}`)))
    })
    .command('web [port]', 'launch website to see notes', yargs => {
        return yargs
            .positional('port', {
                describe: 'port to bind on',
                default: 5000,
                type: 'number'
            })
    }, async (argv) => {
        const notes = await getAllNotes()
        start(notes, argv.port)
    })
    .command('reset', 'remove all notes', () => {}, async argv => {
        removeAllNotes()
            .then(() => console.log(chalk.red('Cleared all notes')))
    })
    .demandCommand(1)
    .parse()