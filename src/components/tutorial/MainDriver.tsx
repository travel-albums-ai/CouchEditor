import { useEffect } from 'react';

import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { driver } from "driver.js";


// const sidebar = [
//   {
//     element: "#sidebar",
//     popover: {
//       title: "Discover all sections",
//       description: "Your photos are organized in sections. You can also pin your favorite sections here.",
//       side: "left",
//     },
//   },
//   {
//     element: "#sort-sections-toggle",
//     popover: {
//       title: "Sort Sections",
//       description: "Use this toggle to sort sections in ascending or descending order.",
//       side: "bottom",
//     },
//   },
//   {
//     element: "#sidebar-section-peopleAndPets",
//     popover: {
//       title: "People & Pets",
//       description: "Discover your friends and pets in your photos.",
//       side: "bottom",
//     },
//   },
//   {
//     element: "#sidebar-section-folders",
//     popover: {
//       title: "Folders",
//       description: "Find what what was indexed in your folders.",
//       side: "bottom",
//     },
//   },
//   {
//     element: "#sidebar-section-countries",
//     popover: {
//       title: "Countries",
//       description: "Discover the countries where your photos were taken.",
//       side: "bottom",
//     },
//   }
// ]

// const statusBar = [
//   {
//     element: "#status-bar",
//     popover: {
//       title: "Status Bar",
//       description: "This bar displays the current status of your application, including any notifications or messages.",
//       side: "top",
//     },
//   },
//   {
//     element: "#database-counts",
//     popover: {
//       title: "Database Counts",
//       description: "This section displays the counts of various items in your database.",
//       side: "top",
//     },
//   },
//   {
//     element: "#zoom-controls",
//     popover: {
//       title: "Zoom controls",
//       description: "Use these controls to zoom in and out of your photos.",
//       side: "top",
//     },
//   },
//   {
//     element: "#indexer",
//     popover: {
//       title: "Indexer",
//       description: "Use the indexer to process your photos efficiently.",
//       side: "top",
//     },
//   },
//   {
//     element: "#keyboard-list",
//     popover: {
//       title: "Be efficient with shortcuts",
//       description: "Consult the list of keyboard shortcuts available in the app. Dynamically updated based on your current context.",
//       side: "top",
//     },
//   },
// ]

const header = [
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
]

export default function MainDriver() {
  const { setSetting } = useSettings()
  const tutorial = useSettingsStoreSelector((state) => state.tutorial);

  useEffect(() => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayColor: "rgba(0,0,0,0.7)",

      steps: [
        ...header,
        // ...sidebar,
        // ...statusBar,
        {
          element: "#outlet-drawer",
          popover: {
            title: "Outlet Drawer",
            description: "This is where your main content is displayed. Psst: is has draggable tabs",
            side: "top",
          },
        },
        {
          element: ".flexlayout__tabset_tabbar_inner",
          popover: {
            title: "Different views",
            description: "Switch between different views of your content using these tabs.",
            side: "top",
          },
        },
        {
          element: "#photo-drawer",
          popover: {
            title: "Photo Drawer",
            description: "This drawer contains your photo content and image details.",
            side: "top",
          },
        },
      ],
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
