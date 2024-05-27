import fastify from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = fastify();
interface User {
  id: number;
  name: string;
  email: string;
}



// Rota para criar um novo usuário
app.post("/usuarios", async (request, reply) => {
    const { name, email } = request.body as User; 
  try {
    const novoUsuario = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    reply.code(201).send(novoUsuario);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    reply.status(500).send({ error: "Erro ao criar usuário" });
  }
});

// Rota para obter todos os usuários
app.get("/usuarios", async (_request, reply) => {
  try {
    const usuarios = await prisma.user.findMany();
    reply.send(usuarios);
  } catch (error) {
    console.error("Erro ao obter usuários:", error);
    reply.status(500).send({ error: "Erro ao obter usuários" });
  }
});

// Rota para atualizar um usuário
app.put<{ Params: { id: string } }>("/usuarios/:id", async (request, reply) => {
  const id = parseInt(request.params.id, 10);
  const { name, email } = request.body as User;
  try {
    const usuarioAtualizado = await prisma.user.update({
      where: { id },
      data: { name, email },
    });
    reply.send(usuarioAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    reply.status(500).send({ error: "Erro ao atualizar usuário" });
  }
});

// Rota para excluir um usuário
app.delete<{ Params: { id: string } }>(
  "/usuarios/:id",
  async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    try {
      await prisma.user.delete({
        where: { id },
      });
      reply.send("Usuário excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      reply.status(500).send({ error: "Erro ao excluir usuário" });
    }
  }
);

// Iniciando o servidor
const start = async () => {
  try {
    await app.listen(3000);
    console.log("Servidor ouvindo na porta 3000");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
