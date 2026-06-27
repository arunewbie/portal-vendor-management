import AppShell from "@/components/AppShell";
export default function ImportOrdersPage() {
  return <AppShell><div className="max-w-2xl"><h1 className="text-2xl font-bold">Import Order CSV</h1><p className="mt-2 text-sm text-slate-500">Upload CSV final setelah validasi Topics Alpha. Field minimal: orderNo,supplierCode,kanbanNo,partNo,partName,qtyOrder,deliveryDate,deliveryTime,cycle.</p><form action="/api/orders/import" method="post" encType="multipart/form-data" className="card mt-6 space-y-4"><input className="input" type="file" name="file" accept=".csv,.txt"/><button className="btn-primary">Upload & Import</button></form></div></AppShell>
}
