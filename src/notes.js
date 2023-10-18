import { insertDB, saveDB, getDB } from "./db.js";
import { v4 as uuidv4 } from 'uuid'

export const createNote = async (note, tags) => {
    let tagsSplit = []

    if (tags !== undefined)
        tagsSplit = tags.split(',')

    const newNote = {
        content: note,
        id: uuidv4(),
        tags: tagsSplit,
        created: Date.now()
    }

    await insertDB(newNote)
    return newNote
}

export const getAllNotes = async () => {
    const {notes} = await getDB()
    return notes
}

export const findNotes = async (filter) => {
    const notes = await getAllNotes()
    const f = filter.toLowerCase()
    return notes.filter(note => note.content.toLowerCase().includes(f))
}

export const removeNote = async (id) => {
    const notes = await getAllNotes()
    const match = notes.find(note => note.id === id)

    if (match) {
        const newNotes = notes.filter(note => note.id !== id)
        await saveDB({notes: newNotes})
        return id
    }
}

export const removeAllNotes = async () => await saveDB({notes: []})
