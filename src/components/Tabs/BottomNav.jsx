import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShieldCheck, Search, FileText, Heart } from 'lucide-react';

function BottomNav() {
  const { pathname } = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/prevent', icon: ShieldCheck, label: 'Prevention' },
    { path: '/detect', icon: Search, label: 'Detection' },
    { path: '/report', icon: FileText, label: 'Reporting' },
    { path: '/legal', icon: Heart, label: 'Support' }
  ];

  return (
    <nav style={styles.navContainer}>
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = pathname === item.path;

        return (
          <Link key={item.path} to={item.path} style={styles.navItemLink}>
            <div style={isActive ? styles.activePill : styles.inactivePill}>
              <IconComponent
                size={22}
                color={styles.iconColor.color}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span style={isActive ? styles.activeLabel : styles.inactiveLabel}>
                {item.label}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}

const styles = {
  navContainer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '80px',
    display: 'flex',
    backgroundColor: 'rgba(242, 240, 255, 0.75)', 
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
    paddingBottom: 'env(safe-area-inset-bottom)',
  },
  navItemLink: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textDecoration: 'none',
    height: '100%',
  },
  iconColor: {
    color: '#4C2A85', 
  },
  inactivePill: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: '8px 12px',
    borderRadius: '16px',
    backgroundColor: 'transparent',
  },
  activePill: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: '8px 12px',
    borderRadius: '16px',
    backgroundColor: '#EBEBFF', 
    transition: 'background-color 0.3s ease',
  },
  inactiveLabel: {
    fontFamily: "'Lora', serif",
    fontSize: '12px',
    fontWeight: '500',
    color: '#4C2A85',
  },
  activeLabel: {
    fontFamily: "'Lora', serif",
    fontSize: '12px',
    fontWeight: '700', 
    color: '#4C2A85',
  },
};

export default BottomNav;