// =========================
// Creación de Nodos
// =========================

// Proveedores: uno mayorista y uno distribuidor
CREATE (:Supplier:Wholesaler {id: "S001", nombre: "Mayorista Central", ubicación: "Zona Industrial", calificación: 4.5});
CREATE (:Supplier:Distributor {id: "S002", nombre: "Distribuidora La Esquina", ubicación: "Zona 2", calificación: 4.7});

// Insumos: uno orgánico y uno perecedero
CREATE (:Ingredient:Organic {id: "I001", nombre: "Lechuga", categoría: "Verdura", precio: 5.0, cantidad_en_existencia: 100, fecha_caducidad: date("2025-04-01")});
CREATE (:Ingredient:Perishable {id: "I002", nombre: "Carne de res", categoría: "Carnes", precio: 20.0, cantidad_en_existencia: 50, fecha_caducidad: date("2025-03-15")});

// Órdenes de compra: una urgente y una recurrente
CREATE (:Order:Urgent {id: "O001", fecha_orden: date("2025-02-26"), cantidad: 30, estado: "pendiente", costo_total: 150.0});
CREATE (:Order:Recurrent {id: "O002", fecha_orden: date("2025-02-25"), cantidad: 50, estado: "completada", costo_total: 300.0});

// Inventarios: uno de frío y uno seco
CREATE (:Inventory:ColdStorage {id: "INV001", ubicación: "Bodega Central", capacidad: 500, cantidad_insumos: 200});
CREATE (:Inventory:DryStorage {id: "INV002", ubicación: "Almacén Seco", capacidad: 1000, cantidad_insumos: 800});

// Ubicaciones: una bodega y un restaurante
CREATE (:Location:Warehouse {id: "L001", nombre: "Bodega Central", tipo_ubicacion: "Warehouse"});
CREATE (:Location:Restaurant {id: "L002", nombre: "Restaurante El Sabor", tipo_ubicacion: "Restaurant"});

// Ruta refrigerada que conecta bodega y restaurante
CREATE (:Route:Refrigerated:Express {id: "R001", origen: "Bodega Central", destino: "Restaurante El Sabor", distancia: 15.5, tipo_transporte: "Refrigerated"});

// Categorías para los insumos
CREATE (:Category {id: "CAT001", nombre: "Verdura"});
CREATE (:Category {id: "CAT002", nombre: "Carnes"});


// =========================
// Creación de Relaciones
// =========================

// SUPPLIES: (Supplier:Wholesaler) suministra (Ingredient:Organic)
MATCH (s:Supplier {id:"S001"}), (i:Ingredient {id:"I001"})
CREATE (s)-[:SUPPLIES {cantidad: 100, fecha: date("2025-02-26")}]->(i);

// STORED_IN: (Ingredient:Perishable) se almacena en (Inventory:ColdStorage)
MATCH (i:Ingredient {id:"I002"}), (inv:Inventory {id:"INV001"})
CREATE (i)-[:STORED_IN {cantidad: 50}]->(inv);

// LOCATED_IN: Inventarios ubicados en Ubicaciones
MATCH (inv:Inventory {id:"INV001"}), (loc:Location {id:"L001"})
CREATE (inv)-[:LOCATED_IN {ciudad: "Ciudad Central"}]->(loc);
MATCH (inv:Inventory {id:"INV002"}), (loc:Location {id:"L002"})
CREATE (inv)-[:LOCATED_IN {ciudad: "Ciudad Sabrosa"}]->(loc);

// CONTAINS: (Order:Urgent) contiene (Ingredient)
MATCH (o:Order {id:"O001"}), (i:Ingredient {id:"I001"})
CREATE (o)-[:CONTAINS {cantidad: 30}]->(i);

// SHIPPED_BY: (Order:Recurrent) es enviado por (Supplier:Distributor)
MATCH (o:Order {id:"O002"}), (s:Supplier {id:"S002"})
CREATE (o)-[:SHIPPED_BY {fecha: date("2025-02-25"), costo: 300.0}]->(s);

// DELIVERED_TO: (Order) es entregado a (Inventory:DryStorage)
MATCH (o:Order {id:"O002"}), (inv:Inventory {id:"INV002"})
CREATE (o)-[:DELIVERED_TO {fecha: date("2025-02-26")}]->(inv);

// CONNECTS: La ruta conecta ambas ubicaciones (bodega y restaurante)
MATCH (r:Route {id:"R001"}), (loc:Location {id:"L001"})
CREATE (r)-[:CONNECTS {distancia: 15.5, tipo: "Directo"}]->(loc);
MATCH (r:Route {id:"R001"}), (loc:Location {id:"L002"})
CREATE (r)-[:CONNECTS {distancia: 15.5, tipo: "Directo"}]->(loc);

// HAS_ORDER: Proveedores con sus órdenes
MATCH (s:Supplier {id:"S001"}), (o:Order {id:"O001"})
CREATE (s)-[:HAS_ORDER {estado: "pendiente"}]->(o);
MATCH (s:Supplier {id:"S002"}), (o:Order {id:"O002"})
CREATE (s)-[:HAS_ORDER {estado: "completada"}]->(o);

// BELONGS_TO: Insumos pertenecen a su categoría
MATCH (i:Ingredient {id:"I001"}), (c:Category {id:"CAT001"})
CREATE (i)-[:BELONGS_TO {categoría: "Verdura"}]->(c);
MATCH (i:Ingredient {id:"I002"}), (c:Category {id:"CAT002"})
CREATE (i)-[:BELONGS_TO {categoría: "Carnes"}]->(c);

// PARTNERS_WITH: Relación de alianza entre proveedores
MATCH (s1:Supplier {id:"S001"}), (s2:Supplier {id:"S002"})
CREATE (s1)-[:PARTNERS_WITH {desde: date("2025-01-01")}]->(s2);
