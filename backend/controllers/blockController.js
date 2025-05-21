const Block = require('../models/Block');

// Obtener bloques sin _id
exports.getBlocks = async (req, res) => {
    try {
        const blocks = await Block.find({}, { name: 1, x: 1, y: 1, z: 1, _id: 0 });
        res.json(blocks);
    } catch (error) {
        console.error('Error al obtener bloques:', error);
        res.status(500).json({ message: 'Error al obtener bloques' });
    }
};

// Agregar un nuevo bloque
exports.addBlock = async (req, res) => {
    try {
        console.log('Recibido POST /api/blocks con body:', req.body);

        const { name, x, y, z } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'El campo name es obligatorio' });
        }

        const newBlock = new Block({ name, x, y, z });
        await newBlock.save();

        res.status(201).json({ message: 'Bloque guardado', block: newBlock });
    } catch (error) {
        console.error('Error al guardar bloque:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Cargar lote desde JSON (para inicialización desde Blender)
exports.addMultipleBlocks = async (req, res) => {
    try {
        const blocks = req.body; // array [{ x, y, z }, ...]
        
        if (!Array.isArray(blocks)) {
            return res.status(400).json({ message: 'Se esperaba un arreglo de bloques' });
        }

        // Opcional: validar que cada bloque tenga 'name'
        for (const block of blocks) {
            if (!block.name) {
                return res.status(400).json({ message: 'Cada bloque debe tener un campo name' });
            }
        }

        await Block.insertMany(blocks);
        res.status(201).json({ message: 'Bloques guardados', count: blocks.length });
    } catch (error) {
        console.error('Error al guardar bloques:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
