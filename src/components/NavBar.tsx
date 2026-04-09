"use client";
import { useState, useEffect, useSyncExternalStore } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { getMockUser, signOutMock, onMockAuthChange } from "@/lib/mock/auth";
import type { NavItem } from "@/types/schema";
import type { User } from "@supabase/supabase-js";

const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

const MotionAppBar = motion.create(AppBar);

interface NavBarProps {
  navItems: NavItem[];
  brandName: string;
}

export default function NavBar({ navItems, brandName }: NavBarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { scrollY } = useScroll();

  const mockUser = useSyncExternalStore(
    IS_MOCK ? onMockAuthChange : () => () => {},
    () => (IS_MOCK ? (getMockUser() as User | null) : null),
    () => null,
  );
  const user = IS_MOCK ? mockUser : supabaseUser;

  const isHome = pathname === "/";
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.97]);
  const borderOpacity = useTransform(scrollY, [60, 120], [0, 0.15]);
  const backgroundColor = useTransform(bgOpacity, (v) =>
    isHome ? `rgba(26,26,46,${v})` : "rgba(26,26,46,0.97)",
  );
  const borderBottom = useTransform(borderOpacity, (v) =>
    isHome
      ? `1px solid rgba(201,168,76,${v})`
      : "1px solid rgba(201,168,76,0.15)",
  );

  useEffect(() => {
    if (IS_MOCK) return;
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setSupabaseUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSupabaseUser(session?.user ?? null);
      },
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    if (IS_MOCK) {
      signOutMock();
      setAnchorEl(null);
      router.refresh();
      return;
    }
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setAnchorEl(null);
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <MotionAppBar
        position="fixed"
        elevation={0}
        style={{
          backgroundColor,
          backdropFilter: "blur(12px)",
          borderBottom,
        }}
        sx={{
          transition: "none",
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: { xs: 64, md: 72 } }}>
            {/* Logo */}
            <Box
              component={Link}
              href="/"
              sx={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexGrow: { xs: 1, md: 0 },
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #c9a84c, #e0c27a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 700,
                  fontSize: 18,
                  color: "#1a1a2e",
                }}
              >
                P
              </Box>
              <Box
                sx={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 700,
                  fontSize: { xs: "1rem", md: "1.15rem" },
                  color: "white",
                  letterSpacing: "-0.01em",
                  display: { xs: "none", sm: "block" },
                }}
              >
                {brandName}
              </Box>
            </Box>

            {/* Desktop nav */}
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 0.5, ml: 4, flexGrow: 1 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    component={Link}
                    href={item.href}
                    sx={{
                      color: isActive(item.href)
                        ? "secondary.main"
                        : "rgba(255,255,255,0.85)",
                      fontWeight: isActive(item.href) ? 700 : 500,
                      fontSize: "0.875rem",
                      "&:hover": { color: "secondary.main" },
                      position: "relative",
                      "&::after": isActive(item.href)
                        ? {
                            content: '""',
                            position: "absolute",
                            bottom: 4,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            bgcolor: "secondary.main",
                          }
                        : {},
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* Right actions */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {!isMobile && (
                <IconButton
                  component={Link}
                  href="/favourites"
                  size="small"
                  sx={{
                    color: "rgba(255,255,255,0.75)",
                    "&:hover": { color: "secondary.main" },
                  }}
                  aria-label="Saved favourites"
                >
                  <FavoriteIcon fontSize="small" />
                </IconButton>
              )}

              {user ? (
                <>
                  <IconButton
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{ color: "secondary.main" }}
                    aria-label="Account menu"
                  >
                    <AccountCircleIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem
                      component={Link}
                      href="/favourites"
                      onClick={() => setAnchorEl(null)}
                    >
                      My Favourites
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
                  </Menu>
                </>
              ) : (
                !isMobile && (
                  <Button
                    component={Link}
                    href="/login"
                    variant="outlined"
                    size="small"
                    sx={{
                      color: "white",
                      borderColor: "rgba(255,255,255,0.4)",
                      "&:hover": {
                        borderColor: "secondary.main",
                        color: "secondary.main",
                      },
                      ml: 1,
                    }}
                  >
                    Sign In
                  </Button>
                )
              )}

              {isMobile && (
                <IconButton
                  edge="end"
                  onClick={() => setDrawerOpen(true)}
                  sx={{ color: "white" }}
                  aria-label="Open navigation menu"
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </MotionAppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: "primary.main",
            color: "white",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 700,
              fontSize: "1.1rem",
            }}
          >
            {brandName}
          </Box>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            sx={{ color: "white" }}
            aria-label="Close menu"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              onClick={() => setDrawerOpen(false)}
              selected={isActive(item.href)}
              sx={{
                "&.Mui-selected": {
                  bgcolor: "rgba(201,168,76,0.15)",
                  color: "secondary.main",
                },
                "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
                color: "rgba(255,255,255,0.85)",
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
          <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", my: 1 }} />
          <ListItemButton
            component={Link}
            href="/favourites"
            onClick={() => setDrawerOpen(false)}
            sx={{
              color: "rgba(255,255,255,0.85)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
            }}
          >
            <ListItemText primary="My Favourites" />
          </ListItemButton>
          {!user && (
            <ListItemButton
              component={Link}
              href="/login"
              onClick={() => setDrawerOpen(false)}
              sx={{ color: "secondary.main" }}
            >
              <ListItemText primary="Sign In" />
            </ListItemButton>
          )}
          {user && (
            <ListItemButton
              onClick={handleLogout}
              sx={{ color: "rgba(255,100,100,0.8)" }}
            >
              <ListItemText primary="Sign Out" />
            </ListItemButton>
          )}
        </List>
      </Drawer>
    </>
  );
}
