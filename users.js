const http = require("node:http");

// Los datos en memoria mantienen la demostración simple; desaparecen al reiniciar el servicio.
const usuarios = {
  "101": { id: "101", nombre: "Ana Torres", correo: "ana@example.com" },
  "102": { id: "102", nombre: "Luis Pérez", correo: "luis@example.com" }
};

const servidor = http.createServer((solicitud, respuesta) => {
  const ruta = new URL(solicitud.url, "http://localhost");
  const coincidencia = ruta.pathname.match(/^\/users\/([^/]+)$/);

  if (solicitud.method !== "GET" || !coincidencia) {
    respuesta.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify({ error: "Ruta no encontrada" }));
    return;
  }

  const usuario = usuarios[coincidencia[1]];
  if (!usuario) {
    respuesta.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify({ error: "Usuario no encontrado" }));
    return;
  }

  respuesta.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  respuesta.end(JSON.stringify(usuario));
});

const puerto = Number(process.env.USERS_PORT || 3001);
servidor.listen(puerto, () => {
  console.log(`Servicio de usuarios disponible en http://localhost:${puerto}`);
});
