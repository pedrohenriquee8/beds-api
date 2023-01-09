import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(express.json());

const port = 3000 || process.env.PORT;
const prisma = new PrismaClient({
    log: ['query'],
});

app.get('/representatives', async (_, res) => {
    try {
        const representative = await prisma.representative.findMany();
        res.status(200).send(representative);
    } catch (error) {
        console.error(error);
    }
});

app.get('/cities', async (_, res) => {
    try {
        const cities = await prisma.city.findMany();
        res.status(200).send(cities);
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: 'City not found' });
    }
});

app.get('/hospitals', async (_, res) => {
    try {
        const hospitals = await prisma.hospital.findMany();
        res.status(200).send(hospitals);
    } catch (error) {
        console.error(error);
    }
});

app.get('/:cityId/hospitals', async (req, res) => {
    const cityId = req.params.cityId;

    try {
        const hospitalsByCityId = await prisma.hospital.findMany({
            where: {
                cityId: Number(cityId),
            }, select: {
                id: true,
                name: true,
                type: true,
                status: true,
                photoUrl: true,
                Bed: {
                    select: {
                        id: true,
                        numberBeds: true,
                        typeBed: true,
                        status: true,
                        photoUrl: true,
                    }
                },
            }
        });
        res.status(200).send(hospitalsByCityId);
    } catch (error) {
        console.error(error);
    }
});

app.get('/beds', async (_, res) => {
    try {
        const beds = await prisma.bed.findMany();
        res.status(200).send(beds);
    } catch (error) {
        console.error(error);
    }
});

app.post('/register', async (req, res) => {
    const { name, email, password, cpf, avatar } = req.body;

    try {
        const representative = await prisma.representative.create({
            data: {
                name,
                email,
                password,
                cpf,
                avatar,
            },
        });
        res.status(201).send({ representative });
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: 'Representative already exists' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const representative = await prisma.representative.findUnique({
            where: {
                email,
            },
        })

        if (representative) {
            representative.password === password ?
                res.status(201).send({ representative }) :
                res.status(404).send({ message: 'Incorrect password' });
        }

        res.status(404).send({ message: 'Representative not found' });
    } catch (error) {
        console.error(error);
    }
});

app.listen(port, () => {
    console.log("Server is running on port " + port);
});
