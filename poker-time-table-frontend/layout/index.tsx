import CssBaseline from "@mui/material/CssBaseline";

export function layout() {
  
  return (
    <div className={classes.root}>
      <CssBaseline />
      <NavigationDrawer isDrawer={isDrawer} />

      <main
        className={clsx(classes.content, {
          [classes.contentShift]: isDrawer,
        })}
      >
        <div className={classes.toolbar} />
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </div>
  );
}