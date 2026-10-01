const http = require("node:http");

// El servicio de pedidos conserva su propio conjunto de datos independiente.
const pedidos = {
  "5001": { id: "5001", usuarioId: "101", producto: "Cuaderno", cantidad: 2 },
  "5002": { id: "5002", usuarioId: "102", producto: "Mochila", cantidad: 1 }
};

const servidor = http.createServer(async (solicitud, respuesta) => {
  const ruta = new URL(solicitud.url, "http://localhost");
  const coincidencia = ruta.pathname.match(/^\/orders\/([^/]+)$/);

  if (solicitud.method !== "GET" || !coincidencia) {
    respuesta.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify({ error: "Ruta no encontrada" }));
    return;
  }

  const pedido = pedidos[coincidencia[1]];
  if (!pedido) {
    respuesta.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify({ error: "Pedido no encontrado" }));
    return;
  }

  const puertoUsuarios = Number(process.env.USERS_PORT || 3001);
  const urlUsuario = `http://localhost:${puertoUsuarios}/users/${encodeURIComponent(pedido.usuarioId)}`;

  try {
    const respuestaUsuario = await fetch(urlUsuario);
    if (respuestaUsuario.status === 404) {
      respuesta.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
      respuesta.end(JSON.stringify({ error: "No se encontró el usuario del pedido" }));
      return;
    }
    if (!respuestaUsuario.ok) {
      throw new Error(`Servicio de usuarios respondió con HTTP ${respuestaUsuario.status}`);
    }

    const usuario = await respuestaUsuario.json();
    respuesta.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify({ ...pedido, usuario }));
  } catch (error) {
    console.error("No fue posible consultar el servicio de usuarios:", error.message);
    respuesta.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify({ error: "El servicio de usuarios no está disponible" }));
  }
});

const puerto = Number(process.env.ORDERS_PORT || 3002);
servidor.listen(puerto, () => {
  console.log(`Servicio de pedidos disponible en http://localhost:${puerto}`);
});
