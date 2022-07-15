import { prisma } from "../../../database/prismaClient";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

interface IAutenticateDeliveryman {
    username: string;
    password: string;
}

export class AuthenticateDeliverymanUseCase {
    async execute({ username, password }: IAutenticateDeliveryman) {
        // Receber username, password,

        // Verificar se username cadastrado
        const deliverymain = await prisma.deliveryman.findFirst({
            where: {
                username
            }
        })

        if(!deliverymain) {
            throw new Error("Username or password invalid!")
        }
        // Verificar se senha corresponde ao username
        const passwordMatch = await compare(password, deliverymain.password);

        if(!passwordMatch) {
            throw new Error("Username or password invalid!")
        }
        // Gerar o token
        const token = sign({username}, "019acc25a4e242bb77ad489832ada12d", {
         subject: deliverymain.id, 
         expiresIn: "1d",
        });

        return token;
    }
}