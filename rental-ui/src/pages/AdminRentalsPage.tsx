import { useCallback, useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Vehicle, listVehiclesApi } from "../api/vehicles.api";
import { type Rental, listRentalsAdminApi, createRentalApi, updateRentalApi, deleteRentalApi } from "../api/rentals.api";


export default function AdminRentalsPage() {
  const [items, setItems] = useState<Rental[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [vehicle, setVehicle] = useState<number>(0);
  const [customer_name, setCustomerName] = useState("");
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const data = await listRentalsAdminApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar vehículos. ¿Login? ¿Token admin?");
    }
  }, []);

  const loadVehicles = useCallback(async () => {
    try {
      const data = await listVehiclesApi();
      setVehicles(data.results); // DRF paginado
      if (data.results.length > 0) setVehicle(data.results[0].id);
    } catch {
      // si falla, no bloquea la pantalla
    }
  }, []);

  useEffect(() => {
    load();
    loadVehicles();
  }, [load, loadVehicles]);

  const save = async () => {
    try {
      setError("");
      if (!vehicle) return setError("Seleccione una vehicle");
      if (!customer_name.trim()) return setError("plate del cliente es requerido");
      if (!total) return setError("Total es requerido");

      const payload = {
        vehicle_id: Number(vehicle),
        customer_name: customer_name.trim(),
        total: total,
        status: status.trim(),
      };

      if (editId) await updateRentalApi(editId, payload);
      else await createRentalApi(payload);

      setEditId(null);
      setCustomerName("");
      setTotal(0);
      setStatus("");
      await load();
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar vehículo. ¿Token admin?");
    }
  };

  const startEdit = (v: Rental) => {
    setEditId(v.id);
    setVehicle(v.vehicle_id);
    setCustomerName(v.customer_name);
    setTotal(v.total);
    setStatus(v.status);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteRentalApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar vehículo. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Rentas (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

            <FormControl sx={{ width: 260 }}>
              <InputLabel id="vehicle-label">Vehicle</InputLabel>
              <Select
                labelId="vehicle-label"
                label="Vehicle"
                value={vehicle}
                onChange={(e) => setVehicle(Number(e.target.value))}
              >
                {vehicles.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.plate} (#{m.id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="plate del cliente" value={customer_name} onChange={(e) => setCustomerName(e.target.value)} fullWidth />
            <TextField label="Total" type="number" value={total} onChange={(e) => setTotal(Number(e.target.value))} sx={{ width: 160 }} />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField label="Status" value={status} onChange={(e) => setStatus(e.target.value)} fullWidth />

            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={() => { setEditId(null); setCustomerName(""); setTotal(0); setStatus(""); }}>Limpiar</Button>
            <Button variant="outlined" onClick={() => { load(); loadVehicles(); }}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>vehicle</TableCell>
              <TableCell>customer_name</TableCell>
              <TableCell>total</TableCell>
              <TableCell>status</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.vehicles_nombre ?? v.vehicle_id}</TableCell>
                <TableCell>{v.customer_name}</TableCell>
                <TableCell>{v.total}</TableCell>
                <TableCell>{v.status}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(v)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(v.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}