//Proveedores
CREATE (:Supplier {ID: "S1", nombre: "Proveedor Central", ubicación: "Guatemala", calificación: 4.5});
CREATE (:Supplier {ID: "S2", nombre: "Distribuidora Los Andes", ubicación: "Quetzaltenango", calificación: 4.2});
CREATE (:Supplier {ID: "S3", nombre: "Mayorista El Buen Sabor", ubicación: "Antigua", calificación: 4.7});
CREATE (:Distributor {ID: "S4", nombre: "Distribuidora Express", ubicación: "Escuintla", calificación: 4.1});
CREATE (:Wholesaler {ID: "S5", nombre: "Super Mayorista", ubicación: "Ciudad de Guatemala", calificación: 4.8});
CREATE (:Supplier {ID: "S6", nombre: "Carnes del Norte", ubicación: "Quiché", calificación: 4.3});
CREATE (:Supplier {ID: "S7", nombre: "Frutas del Trópico", ubicación: "Izabal", calificación: 4.6});
CREATE (:Distributor {ID: "S8", nombre: "Lácteos Frescos", ubicación: "Chimaltenango", calificación: 4.5});
CREATE (:Wholesaler {ID: "S9", nombre: "Supermercado Mayorista", ubicación: "Jalapa", calificación: 4.2});
CREATE (:Supplier {ID: "S10", nombre: "Verduras Selectas", ubicación: "Santa Rosa", calificación: 4.7});


//Insumos
CREATE (:Ingredient:Perishable {ID: "I1", nombre: "Carne de Res", categoría: "Carnes", precio: 50.0, cantidad: 500, fechaCaducidad: date("2025-05-01")});
CREATE (:Ingredient:Perishable {ID: "I2", nombre: "Leche", categoría: "Lácteos", precio: 10.0, cantidad: 200, fechaCaducidad: date("2025-03-20")});
CREATE (:Ingredient:Organic {ID: "I3", nombre: "Espinaca", categoría: "Verduras", precio: 5.0, cantidad: 300, fechaCaducidad: date("2025-03-15")});
CREATE (:Ingredient {ID: "I4", nombre: "Harina", categoría: "Panadería", precio: 8.0, cantidad: 1000});
CREATE (:Ingredient {ID: "I5", nombre: "Azúcar", categoría: "Endulzantes", precio: 7.0, cantidad: 600});
CREATE (:Ingredient:Perishable {ID: "I6", nombre: "Pollo", categoría: "Carnes", precio: 45.0, cantidad: 600, fechaCaducidad: date("2025-06-10")});
CREATE (:Ingredient:Perishable {ID: "I7", nombre: "Queso", categoría: "Lácteos", precio: 20.0, cantidad: 300, fechaCaducidad: date("2025-04-15")});
CREATE (:Ingredient:Organic {ID: "I8", nombre: "Tomates", categoría: "Verduras", precio: 4.0, cantidad: 400, fechaCaducidad: date("2025-03-25")});
CREATE (:Ingredient {ID: "I9", nombre: "Arroz", categoría: "Cereales", precio: 12.0, cantidad: 800});
CREATE (:Ingredient {ID: "I10", nombre: "Sal", categoría: "Condimentos", precio: 5.0, cantidad: 1000});


//Ordenes de compra
CREATE (:Order:Urgent {ID: "O1", fechaOrden: date("2025-02-20"), cantidad: 100, estado: "Pendiente", costoTotal: 5000.0});
CREATE (:Order:Recurrent {ID: "O2", fechaOrden: date("2025-02-15"), cantidad: 50, estado: "Completado", costoTotal: 2500.0});
CREATE (:Order {ID: "O3", fechaOrden: date("2025-02-22"), cantidad: 75, estado: "Enviado", costoTotal: 3750.0});
CREATE (:Order:Urgent {ID: "O4", fechaOrden: date("2025-02-25"), cantidad: 200, estado: "Pendiente", costoTotal: 10000.0});
CREATE (:Order:Recurrent {ID: "O5", fechaOrden: date("2025-02-18"), cantidad: 90, estado: "Enviado", costoTotal: 4500.0});
CREATE (:Order {ID: "O6", fechaOrden: date("2025-02-28"), cantidad: 120, estado: "Completado", costoTotal: 6000.0});


//Inventarios
CREATE (:Inventory:ColdStorage {ID: "INV1", ubicación: "Bodega Central", capacidad: 1000, cantidadAlmacenada: 700});
CREATE (:Inventory:DryStorage {ID: "INV2", ubicación: "Almacén Zona 10", capacidad: 500, cantidadAlmacenada: 300});
CREATE (:Inventory:ColdStorage {ID: "INV3", ubicación: "Bodega Norte", capacidad: 1500, cantidadAlmacenada: 900});
CREATE (:Inventory:DryStorage {ID: "INV4", ubicación: "Almacén Zona 15", capacidad: 700, cantidadAlmacenada: 500});


//Ubicaciones
CREATE (:Location:Warehouse {ID: "LOC1", nombre: "Bodega Central", tipo: "Bodega"});
CREATE (:Location:Restaurant {ID: "LOC2", nombre: "Restaurante El Buen Gusto", tipo: "Restaurante"});
CREATE (:Location:Warehouse {ID: "LOC3", nombre: "Bodega Norte", tipo: "Bodega"});
CREATE (:Location:Restaurant {ID: "LOC4", nombre: "Restaurante Delicias", tipo: "Restaurante"});


//Rutas
CREATE (:Route:Refrigerated {ID: "R1", origen: "Bodega Central", destino: "Restaurante El Buen Gusto", distancia: 15.0, tipo: "Refrigerado"});
CREATE (:Route:Express {ID: "R2", origen: "Bodega Central", destino: "Almacén Zona 10", distancia: 10.0, tipo: "Express"});
CREATE (:Route:Refrigerated {ID: "R3", origen: "Bodega Norte", destino: "Restaurante Delicias", distancia: 20.0, tipo: "Refrigerado"});
CREATE (:Route:Express {ID: "R4", origen: "Bodega Norte", destino: "Almacén Zona 15", distancia: 12.0, tipo: "Express"});


//Relación de Proveedores e Insumos
MATCH (s:Supplier {ID: "S1"}), (i:Ingredient {ID: "I1"})
CREATE (s)-[:SUPPLIES {cantidad: 100, fecha: date("2025-02-10")}]->(i);

MATCH (s:Distributor {ID: "S4"}), (i:Ingredient:Perishable {ID: "I2"})
CREATE (s)-[:SUPPLIES {cantidad: 200, fecha: date("2025-02-12")}]->(i);

MATCH (s:Supplier {ID: "S6"}), (i:Ingredient {ID: "I6"})
CREATE (s)-[:SUPPLIES {cantidad: 150, fecha: date("2025-02-15")}]->(i);

MATCH (s:Distributor {ID: "S8"}), (i:Ingredient:Perishable {ID: "I7"})
CREATE (s)-[:SUPPLIES {cantidad: 250, fecha: date("2025-02-17")}]->(i);



//Relación de Insumos con Inventarios
MATCH (i:Ingredient {ID: "I1"}), (inv:Inventory:ColdStorage {ID: "INV1"})
CREATE (i)-[:STORED_IN {cantidad: 80}]->(inv);

MATCH (i:Ingredient {ID: "I5"}), (inv:Inventory:DryStorage {ID: "INV2"})
CREATE (i)-[:STORED_IN {cantidad: 150}]->(inv);

MATCH (i:Ingredient {ID: "I8"}), (inv:Inventory:ColdStorage {ID: "INV3"})
CREATE (i)-[:STORED_IN {cantidad: 120}]->(inv);

MATCH (i:Ingredient {ID: "I9"}), (inv:Inventory:DryStorage {ID: "INV4"})
CREATE (i)-[:STORED_IN {cantidad: 300}]->(inv);


//Relación de Órdenes e Insumos
MATCH (o:Order:Urgent {ID: "O1"}), (i:Ingredient {ID: "I1"})
CREATE (o)-[:CONTAINS {cantidad: 50}]->(i);

MATCH (o:Order:Recurrent {ID: "O2"}), (i:Ingredient {ID: "I3"})
CREATE (o)-[:CONTAINS {cantidad: 30}]->(i);

MATCH (o:Order:Urgent {ID: "O4"}), (i:Ingredient {ID: "I6"})
CREATE (o)-[:CONTAINS {cantidad: 70}]->(i);

MATCH (o:Order:Recurrent {ID: "O5"}), (i:Ingredient {ID: "I8"})
CREATE (o)-[:CONTAINS {cantidad: 40}]->(i);


// Relación de Órdenes con Proveedores
MATCH (o:Order {ID: "O1"}), (s:Supplier {ID: "S1"})
CREATE (s)-[:HAS_ORDER {estado: "Pendiente"}]->(o);

MATCH (o:Order {ID: "O2"}), (s:Distributor {ID: "S4"})
CREATE (s)-[:HAS_ORDER {estado: "Completado"}]->(o);

MATCH (o:Order {ID: "O4"}), (s:Supplier {ID: "S6"})
CREATE (s)-[:HAS_ORDER {estado: "Pendiente"}]->(o);

MATCH (o:Order {ID: "O5"}), (s:Distributor {ID: "S8"})
CREATE (s)-[:HAS_ORDER {estado: "Enviado"}]->(o);



//Relación de Inventarios con Ubicaciones
MATCH (inv:Inventory {ID: "INV1"}), (loc:Location {ID: "LOC1"})
CREATE (inv)-[:LOCATED_IN {ciudad: "Guatemala"}]->(loc);

MATCH (inv:Inventory {ID: "INV2"}), (loc:Location {ID: "LOC2"})
CREATE (inv)-[:LOCATED_IN {ciudad: "Guatemala"}]->(loc);

MATCH (inv:Inventory {ID: "INV3"}), (loc:Location {ID: "LOC3"})
CREATE (inv)-[:LOCATED_IN {ciudad: "Quiché"}]->(loc);

MATCH (inv:Inventory {ID: "INV4"}), (loc:Location {ID: "LOC4"})
CREATE (inv)-[:LOCATED_IN {ciudad: "Guatemala"}]->(loc);


//Relación de Rutas de Transporte
MATCH (r:Route {ID: "R1"}), (loc1:Location {ID: "LOC1"}), (loc2:Location {ID: "LOC2"})
CREATE (r)-[:CONNECTS {distancia: 15.0, tipo: "Refrigerado"}]->(loc1),
       (r)-[:CONNECTS {distancia: 15.0, tipo: "Refrigerado"}]->(loc2);

MATCH (r:Route {ID: "R3"}), (loc1:Location {ID: "LOC3"}), (loc2:Location {ID: "LOC4"})
CREATE (r)-[:CONNECTS {distancia: 20.0, tipo: "Refrigerado"}]->(loc1),
       (r)-[:CONNECTS {distancia: 20.0, tipo: "Refrigerado"}]->(loc2);


