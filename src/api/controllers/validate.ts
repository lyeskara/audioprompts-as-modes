import { Request, Response } from 'express';

export default async function validate(req: Request, res: Response) {
    res.status(200).send("password is valid if this handler is reached.")
}