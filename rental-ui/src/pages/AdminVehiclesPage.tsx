import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Vehicle, listVehiclesApi, createVehicleApi, updateVehicleApi, deleteVehicleApi } from "../api/vehicles.api";

export default function AdminVehiclesPage() {
  const [items, setItems] = useState<Vehicle[]>([]);
  const [brand, setBrand] = useState<string | null>(null);
  const [dailyRate, setDailyRate] = useState<number | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [plate, setPlate] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listVehiclesApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar vehículos. ¿Login? ¿Token admin?");
    }
  };

  useEffect(() => { load(); }, []);

const save = async () => {

    const payload = {
        plate: plate?.trim() || "",
        brand: brand?.trim() || "",
        daily_rate: dailyRate || 0,
        is_available: isAvailable,
      };
    try {
      setError("");
      if (!plate?.trim()) return setError("Placa requerida");

      if (editId) await updateVehicleApi(editId, payload);
      else await createVehicleApi(payload);

      setPlate(null);
      setEditId(null);
      await load();
    } catch {
      setError("No se pudo guardar vehículo. ¿Token admin?");
    }
  };

  const startEdit = (m: Vehicle) => {
    setEditId(m.id);
    setPlate(m.plate);
    setBrand(m.brand);
    setDailyRate(m.daily_rate);
    setIsAvailable(m.is_available);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteVehicleApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar Vehicle. ¿Vehículos asociados? ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Vehicles (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
          <TextField label="plate vehicle" value={plate} onChange={(e) => setPlate(e.target.value)} fullWidth />
          <TextField label="brand vehicle" value={brand} onChange={(e) => setBrand(e.target.value)} fullWidth />
          <TextField label="daily rate vehicle" value={dailyRate} onChange={(e) => setDailyRate(Number(e.target.value))} fullWidth />
          <TextField label="is available vehicle" value={isAvailable} onChange={(e) => setIsAvailable(e.target.value === "true")} fullWidth />
          <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
          <Button variant="outlined" onClick={() => { setPlate(""); setEditId(null); }}>Limpiar</Button>
          <Button variant="outlined" onClick={load}>Refrescar</Button>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>plate</TableCell>
              <TableCell>brand</TableCell>
            <TableCell>daily_rate</TableCell>
                <TableCell>is_available</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.id}</TableCell>
                <TableCell>{m.plate}</TableCell>
                <TableCell>{m.brand}</TableCell>
                <TableCell>{m.daily_rate}</TableCell>
                <TableCell>{m.is_available ? "Sí" : "No"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(m)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(m.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}