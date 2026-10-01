# Demostración de microservicios REST

Ejemplo educativo con dos procesos Node.js independientes y sin dependencias externas:

- `users.js`: responde `GET /users/:id` en el puerto 3001.
- `orders.js`: responde `GET /orders/:id` en el puerto 3002 y consulta al servicio de usuarios.

Se requiere Node.js 18 o superior (incluye `fetch` en la biblioteca estándar). No hace falta ejecutar `npm install`.

## Ejecutar

Abre dos terminales en esta carpeta:

```powershell
npm run start:users
```

```powershell
npm run start:orders
```

En una tercera terminal, prueba la comunicación:

```powershell
Invoke-RestMethod http://localhost:3002/orders/5001
```

La respuesta debe incluir los campos del pedido y el usuario Ana Torres. También puedes consultar directamente:

```powershell
Invoke-RestMethod http://localhost:3001/users/101
```

Pruebas de error:

```powershell
Invoke-RestMethod http://localhost:3002/orders/no-existe
Invoke-RestMethod http://localhost:3002/orders/5002
```

La primera responde con 404. La segunda responde con 502 si el servicio de usuarios está detenido. Los datos de ejemplo están en memoria y se pierden al reiniciar los procesos; no representan almacenamiento de producción.

## Puertos alternativos

Configura `USERS_PORT` para el servicio de usuarios y `ORDERS_PORT` para el de pedidos. El servicio de pedidos usa `USERS_PORT` para ubicar a usuarios.

## Diagrama

```text
Cliente -- GET /orders/5001 --> Servicio de pedidos (:3002)
                                     |
                                     +-- GET /users/101 --> Servicio de usuarios (:3001)
                                     |
Cliente <-- pedido con datos del usuario -----------------+
```

La versión para imprimir del informe y su diagrama visual están en `../entrega.html`.
