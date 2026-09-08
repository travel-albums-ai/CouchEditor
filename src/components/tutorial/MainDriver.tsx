import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { driver, DriveStep } from "driver.js";
import { useEffect } from 'react';

const steps = [
  {
    element: "#pipeline-header-left",
    popover: {
      title: "Header of the app",
      description: "Reach settings, fullscreen mode, dark/light mode and more from here.",
      side: "bottom",
    },
  },
  {
    element: "#pipeline-name",
    popover: {
      title: "Pipeline Name",
      description: "This section displays the name of the current pipeline.",
      side: "bottom",
    },
  },
  {
    element: "#pipeline-actions",
    popover: {
      title: "Pipeline Actions",
      description: "This section contains actions you can perform on the current pipeline.",
      side: "bottom",
    },
  },
  {
    element: "#pipeline-header-right",
    popover: {
      title: "Header Right Section",
      description: "Access search, notifications, and other utilities from this section of the header.",
      side: "bottom",
    },
  },
  {
    element: "#pipeline-loader",
    popover: {
      title: "Pipeline Loader",
      description: "This section shows the saved pipelines that are available to load.",
      side: "bottom",
    },
  },
  {
    element: "#toggle-toolbox-toggle",
    popover: {
      title: "Toggle Toolbox",
      description: "Use this toggle to open and close the pipeline toolbox.",
      side: "bottom",
    },
  },
  {
    element: "#settings-toggle",
    popover: {
      title: "Settings Toggle",
      description: "Use this toggle to open and close the settings panel.",
      side: "bottom",
    },
  },
  {
    element: "#dark-light-toggle",
    popover: {
      title: "Dark/Light Mode",
      description: "Use this toggle to switch between dark and light themes.",
      side: "bottom",
    },
  },
  {
    element: "#performance-toggle",
    popover: {
      title: "Performance Mode",
      description: "Use this toggle to switch between different performance modes.",
      side: "bottom",
    },
  },
  {
    element: "#fullscreen-toggle",
    popover: {
      title: "Fullscreen Toggle",
      description: "Use this toggle to enter or exit fullscreen mode.",
      side: "bottom",
    },
  },
  {
    element: "#extended-menu-toggle",
    popover: {
      title: "Extended Menu",
      description: "Use this menu to access additional settings and options.",
      side: "bottom",
    },
  },
  {
    element: "#pipeline-toolbox",
    popover: {
      title: "Pipeline Toolbox",
      description: "Use this toolbox to access various pipeline tools and functionalities.",
      side: "bottom",
    },
  },
  {
    element: "#pipeline-trash",
    popover: {
      title: "Pipeline Trash",
      description: "Use this toggle to open and close the pipeline trash.",
      side: "bottom",
    },
  },
  {
    element: "#outlet-drawer",
    popover: {
      title: "Main Screen",
      description: "This is where your main content is displayed. Psst: is has draggable items",
      side: "top",
    },
  },
] as DriveStep[]

export default function MainDriver() {
  const { setSetting } = useSettings()
  const tutorial = useSettingsStoreSelector((state) => state.tutorial);

  useEffect(() => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayColor: "rgba(0,0,0,0.7)",

      steps,
      onDestroyed: () => {
        setSetting((prev) => ({
          ...prev,
          tutorial: false,
        }));
      },
    });

    if (tutorial) {
      driverObj.drive();
    }

    return () => driverObj.destroy();
  }, [tutorial, setSetting]);

  return null
}
