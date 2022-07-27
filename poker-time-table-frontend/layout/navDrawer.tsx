import React, { memo } from 'react';
import { Link } from 'react-router-dom';

import Dashboard from '@mui/icons-material/Dashboard';
import { SvgIconProps  } from '@mui/material'
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';

import useStyles from './navDrawer.module';

type IProps = {
  isDrawer: boolean;
};

interface NavgationItem {
  title: string
  href: string
  icon: React.ComponentType<SvgIconProps>
  label: string
}

const navigationItems: NavgationItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Dashboard,
    label: ''
  }
]

const renderItem = (item: NavgationItem) => {
  return (
    <>
    {

    }
    </>
  )
};

const renderNavDrawerItems = (items: NavgationItem[]) => {
  return (
    <>
    {
      items.map((item: NavgationItem) => {
        return (
          <ListItem className={clsx(classes.itemLeaf)} disableGutters key={title}>
            {canAction('view', label || '') ? (
              <>
                {isExternalLink ? (
                  <Link href={href} target="_blank" style={style} className={clsx(classes.buttonLeaf, `depth-${depth}`)}>
                    {Icon && <Icon className={classes.icon} size="20" />}
                    <span className={classes.title}>{title}</span>
                  </Link>
                ) : (
                  <Button
                    activeClassName={classes.active}
                    className={clsx(classes.buttonLeaf, `depth-${depth}`)}
                    component={RouterLink}
                    exact
                    style={style}
                    to={href}
                  >
                    {Icon && <Icon className={classes.icon} size="20" />}
                    <span className={classes.title}>{title}</span>
                  </Button>
                )}
              </>
            ) : null}
          </ListItem>
          <NavBarItem
            key={`alone-${key}`}
            depth={depth}
            href={curr.href}
            icon={curr.icon}
            title={curr.title}
            label={curr.label}
            isExternalLink={curr.isExternalLink}
          />
          <List disablePadding>
            {item?.reduce((acc, curr) => renderChildRoutes({ acc, curr, pathname, depth }), [])}
          </List>
        )
      })
    };
    </>
  )
}

function NavDrawer({ isDrawer }: IProps) {
  const classes = useStyles();
  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={isDrawer}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Divider />

      {renderNavDrawerItems(navigationItems)}
    </Drawer>
  );
}

export default memo(NavDrawer);