"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Tooltip,
  Stack,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { loadAdminStore, saveAdminStore } from "@/lib/adminStore";
import type { AdminStore } from "@/lib/adminStore";
import type { Agent } from "@/types/schema";
import {
  getAdminData,
  upsertAgentAction,
  deleteAgentAction,
} from "@/lib/actions/admin";

const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

function emptyAgent(): Omit<Agent, "id"> {
  return {
    name: "",
    title: "",
    photo: "",
    email: "",
    phone: "",
    bio: "",
    specialties: [],
    languages: [],
    location: "",
    salesCount: 0,
    listingIds: [],
  };
}

interface EditDialogProps {
  open: boolean;
  agent: Agent | null;
  onClose: () => void;
  onSave: (agent: Agent) => Promise<void> | void;
}

function EditDialog({ open, agent, onClose, onSave }: EditDialogProps) {
  const isNew = !agent?.id || agent.id.startsWith("new-");
  const [form, setForm] = useState<Agent>(
    () => agent ?? ({ id: `new-${Date.now()}`, ...emptyAgent() } as Agent),
  );

  const set = (field: keyof Agent, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>{isNew ? "Add New Agent" : "Edit Agent"}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Personal Info
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Full Name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Title / Role"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              fullWidth
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              fullWidth
            />
            <TextField
              label="Phone"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              fullWidth
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Location"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              fullWidth
            />
            <TextField
              label="Sales Count"
              type="number"
              value={form.salesCount}
              onChange={(e) => set("salesCount", Number(e.target.value))}
              fullWidth
            />
          </Stack>
          <TextField
            label="Photo URL"
            value={form.photo}
            onChange={(e) => set("photo", e.target.value)}
            fullWidth
            helperText="Paste an image URL (e.g. from Unsplash)"
          />

          <Divider />
          <Typography variant="subtitle2" color="text.secondary">
            Bio & Expertise
          </Typography>
          <TextField
            label="Bio"
            value={form.bio}
            onChange={(e) => set("bio", e.target.value)}
            multiline
            minRows={3}
            fullWidth
          />
          <TextField
            label="Specialties (comma-separated)"
            value={form.specialties.join(", ")}
            onChange={(e) =>
              set(
                "specialties",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
            fullWidth
          />
          <TextField
            label="Languages (comma-separated)"
            value={form.languages.join(", ")}
            onChange={(e) =>
              set(
                "languages",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => onSave(form)}
          disabled={!form.name || !form.email}
        >
          {isNew ? "Add Agent" : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function AdminAgentsPage() {
  const [store, setStore] = useState<AdminStore | null>(() =>
    IS_MOCK ? loadAdminStore() : null,
  );
  const [editTarget, setEditTarget] = useState<Agent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    severity: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!IS_MOCK) {
      getAdminData()
        .then(setStore)
        .catch(() => setStore(loadAdminStore()));
    }
  }, []);

  const persist = useCallback((updated: AdminStore) => {
    setStore(updated);
    if (IS_MOCK) saveAdminStore(updated);
  }, []);

  const handleEdit = (agent: Agent) => {
    setEditTarget(agent);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditTarget({ id: `new-${Date.now()}`, ...emptyAgent() } as Agent);
    setDialogOpen(true);
  };

  const handleSave = async (agent: Agent) => {
    if (!store) return;
    const exists = store.agents.some((a) => a.id === agent.id);
    const updatedAgents = exists
      ? store.agents.map((a) => (a.id === agent.id ? agent : a))
      : [...store.agents, agent];
    persist({ ...store, agents: updatedAgents });
    setDialogOpen(false);

    if (!IS_MOCK) {
      const { error } = await upsertAgentAction(agent);
      if (error) {
        setToast({ msg: error, severity: "error" });
        return;
      }
    }

    setToast({
      msg: exists ? "Agent updated." : "Agent added.",
      severity: "success",
    });
  };

  const handleDelete = async (id: string) => {
    if (!store) return;
    if (
      !confirm(
        "Delete this agent? Any listings assigned to them will need reassignment.",
      )
    )
      return;
    persist({ ...store, agents: store.agents.filter((a) => a.id !== id) });

    if (!IS_MOCK) {
      const { error } = await deleteAgentAction(id);
      if (error) {
        setToast({ msg: error, severity: "error" });
        return;
      }
    }

    setToast({ msg: "Agent deleted.", severity: "success" });
  };

  if (!store) return null;

  return (
    <Box sx={{ p: { xs: 3, md: 4 } }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Agents
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {store.agents.length} agents on the team
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add Agent
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{ "& th": { fontWeight: 700, bgcolor: "grey.50" } }}
              >
                <TableCell>Agent</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Specialties</TableCell>
                <TableCell>Languages</TableCell>
                <TableCell align="center">Sales</TableCell>
                <TableCell align="center">Listings</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {store.agents.map((agent) => {
                const listingCount = store.listings.filter(
                  (l) => l.agentId === agent.id,
                ).length;
                return (
                  <TableRow key={agent.id} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar
                          src={agent.photo}
                          alt={agent.name}
                          sx={{ width: 36, height: 36 }}
                        />
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {agent.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {agent.title}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" display="block">
                        {agent.email}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {agent.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {agent.location}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {agent.specialties.map((s) => (
                          <Chip
                            key={s}
                            label={s}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {agent.languages.join(", ")}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {agent.salesCount}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={listingCount}
                        size="small"
                        color={listingCount > 0 ? "primary" : "default"}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(agent)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(agent.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <EditDialog
        key={editTarget?.id ?? "new"}
        open={dialogOpen}
        agent={editTarget}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast?.severity}
          variant="filled"
          onClose={() => setToast(null)}
        >
          {toast?.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
