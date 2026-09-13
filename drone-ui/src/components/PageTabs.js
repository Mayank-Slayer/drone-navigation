import React from "react";

const PageTabs = ({
  activePage,
  setActivePage,
}) => {

  const pages = [

    "Dashboard",

    "Mission",

    "Radar",

    "Surveillance",

    "3D Simulator",

  ];

  return (

    <div
      style={{

        display: "flex",

        gap: "12px",

        marginBottom: "20px",

        flexWrap: "wrap",

      }}
    >

      {pages.map((page) => (

        <button

          key={page}

          onClick={() =>
            setActivePage(page)
          }

          style={{

            padding: "12px 18px",

            borderRadius: "12px",

            border: "none",

            cursor: "pointer",

            fontWeight: "bold",

            background:
              activePage === page
                ? "#06b6d4"
                : "#1e3a8a",

            color: "white",

            boxShadow:
              "0 0 15px rgba(59,130,246,0.5)",

          }}
        >

          {page}

        </button>

      ))}

    </div>

  );
};

export default PageTabs;