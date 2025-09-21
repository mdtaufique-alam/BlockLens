import React, { useContext } from 'react';
import { CryptoContext } from '../context/CryptoContext';

export const DashboardModeToggle = () => {
  const { dashboardMode, setDashboardMode } = useContext(CryptoContext);

  const getThemeClasses = () => {
    return {
      container: 'flex items-center space-x-2',
      label: 'text-sm font-medium text-gray-600',
      toggle: 'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      toggleActive: 'bg-blue-600',
      toggleInactive: 'bg-gray-200',
      slider: 'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
      sliderActive: 'translate-x-6',
      sliderInactive: 'translate-x-1',
      text: 'text-xs font-medium text-gray-500'
    };
  };

  const classes = getThemeClasses();

  return (
    <div className={classes.container}>
      <span className={classes.label}>BlockLens</span>
      <button
        type="button"
        className={`${classes.toggle} ${
          dashboardMode === 'bexet' ? classes.toggleActive : classes.toggleInactive
        }`}
        onClick={() => setDashboardMode(dashboardMode === 'blocklens' ? 'bexet' : 'blocklens')}
        aria-label="Toggle dashboard mode"
      >
        <span
          className={`${classes.slider} ${
            dashboardMode === 'bexet' ? classes.sliderActive : classes.sliderInactive
          }`}
        />
      </button>
      <span className={classes.label}>BEXET</span>
    </div>
  );
};
