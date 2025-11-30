const WELL_CONFIGS = {
    standard: {
        name: "Standard Well",
        targetDepth: 10000,
        targetPath: [
            { depth: 0,    x: 400 },
            { depth: 3000, x: 400 },
            { depth: 6000, x: 550 },
            { depth: 10000, x: 550 }
        ],
        formations: [
            { 
                limit: 1000,  
                name: "Top Soil",       
                color: "#5d4037", 
                particle: "#795548", 
                hardness: 0.3,
                abrasiveness: 0.1, 
                driftTendency: 0.3,
                lossZone: null,
                kickZone: null
            },
            { 
                limit: 3000,  
                name: "Sandstone",      
                color: "#8d6e63", 
                particle: "#d7ccc8", 
                hardness: 0.5,
                abrasiveness: 1.0, 
                driftTendency: -0.2,
                lossZone: { start: 1500, end: 1600, maxMW: 11.5, maxLossRate: 200 },
                kickZone: null
            },
            { 
                limit: 4500,  
                name: "Hard Limestone", 
                color: "#616161", 
                particle: "#9e9e9e", 
                hardness: 2.0,
                abrasiveness: 2.0, 
                driftTendency: 0.6,
                lossZone: { start: 3200, end: 3350, maxMW: 10.8, maxLossRate: 350 },
                kickZone: null
            }, 
            { 
                limit: 6500,  
                name: "Pierre Shale",   
                color: "#37474f", 
                particle: "#78909c", 
                hardness: 0.4,
                abrasiveness: 0.5, 
                driftTendency: -0.4,
                lossZone: null,
                kickZone: null
            }, 
            { 
                limit: 8000,  
                name: "Hard Dolomite",  
                color: "#424242", 
                particle: "#bdbdbd", 
                hardness: 4.5,
                abrasiveness: 2.5, 
                driftTendency: 0.8,
                lossZone: { start: 6800, end: 6950, maxMW: 11.2, maxLossRate: 300 },
                kickZone: null
            },
            { 
                limit: 10001, 
                name: "Deep Shale",     
                color: "#263238", 
                particle: "#546e7a", 
                hardness: 0.5,
                abrasiveness: 0.6, 
                driftTendency: -0.3,
                lossZone: null,
                kickZone: { start: 8500, end: 8700, minMW: 10.5 }
            }
        ],
        normalPressureMW: 10.0
    },
    
    bakken: {
        name: "Bakken Horizontal - Williston Basin, ND",
        targetDepth: 12000,
        targetPath: [
            { depth: 0,    x: 400 },
            { depth: 8500, x: 400 },  // Vertical section (kickoff point)
            { depth: 9500, x: 500 },  // Build curve
            { depth: 10500, x: 650 }, // Continue curve
            { depth: 12000, x: 650 }  // Horizontal lateral in Bakken
        ],
        formations: [
            { 
                limit: 500,  
                name: "Glacial Till",       
                color: "#6d4c41", 
                particle: "#8d6e63", 
                hardness: 0.25,
                abrasiveness: 0.2, 
                driftTendency: 0.1,
                lossZone: null,
                kickZone: null
            },
            { 
                limit: 2500,  
                name: "Pierre Shale",      
                color: "#455a64", 
                particle: "#78909c", 
                hardness: 0.4,
                abrasiveness: 0.3, 
                driftTendency: -0.3,
                lossZone: { start: 1200, end: 1400, maxMW: 10.5, maxLossRate: 250 },
                kickZone: null
            },
            { 
                limit: 5000,  
                name: "Greenhorn Limestone", 
                color: "#757575", 
                particle: "#bdbdbd", 
                hardness: 2.5,
                abrasiveness: 1.8, 
                driftTendency: 0.5,
                lossZone: null,
                kickZone: null
            }, 
            { 
                limit: 7500,  
                name: "Belle Fourche Shale",   
                color: "#37474f", 
                particle: "#607d8b", 
                hardness: 0.5,
                abrasiveness: 0.4, 
                driftTendency: -0.4,
                lossZone: null,
                kickZone: null
            }, 
            { 
                limit: 9000,  
                name: "Madison Limestone",  
                color: "#9e9e9e", 
                particle: "#e0e0e0", 
                hardness: 3.5,
                abrasiveness: 2.2, 
                driftTendency: 0.7,
                lossZone: { start: 8200, end: 8400, maxMW: 11.8, maxLossRate: 400 },
                kickZone: null
            },
            { 
                limit: 9800, 
                name: "Lodgepole Limestone",     
                color: "#616161", 
                particle: "#9e9e9e", 
                hardness: 3.0,
                abrasiveness: 2.0, 
                driftTendency: 0.6,
                lossZone: null,
                kickZone: null
            },
            { 
                limit: 10200, 
                name: "Three Forks",     
                color: "#4e342e", 
                particle: "#795548", 
                hardness: 1.8,
                abrasiveness: 1.2, 
                driftTendency: -0.2,
                lossZone: null,
                kickZone: { start: 9900, end: 10100, minMW: 11.5 }
            },
            { 
                limit: 12001, 
                name: "Bakken Shale",     
                color: "#1a1a1a", 
                particle: "#424242", 
                hardness: 0.6,
                abrasiveness: 0.5, 
                driftTendency: -0.5,
                lossZone: null,
                kickZone: { start: 10300, end: 11500, minMW: 12.0 }
            }
        ],
        normalPressureMW: 11.5
    },
    
    deepOffshore: {
        name: "Deep Offshore",
        targetDepth: 15000,
        targetPath: [
            { depth: 0,    x: 400 },
            { depth: 2000, x: 400 },
            { depth: 5000, x: 500 },
            { depth: 10000, x: 600 },
            { depth: 15000, x: 600 }
        ],
        formations: [
            { 
                limit: 2000,  
                name: "Seabed",         
                color: "#3e2723", 
                particle: "#5d4037", 
                hardness: 0.2, 
                abrasiveness: 0.1, 
                driftTendency: 0.1,
                lossZone: null,
                kickZone: null
            },
            { 
                limit: 5000,  
                name: "Soft Shale",     
                color: "#455a64", 
                particle: "#78909c", 
                hardness: 0.4, 
                abrasiveness: 0.4, 
                driftTendency: -0.5,
                lossZone: { start: 3000, end: 3200, maxMW: 12.5, maxLossRate: 250 },
                kickZone: null
            },
            { 
                limit: 8000,  
                name: "Hard Sandstone", 
                color: "#6d4c41", 
                particle: "#a1887f", 
                hardness: 1.5, 
                abrasiveness: 1.5, 
                driftTendency: 0.4,
                lossZone: null,
                kickZone: null
            },
            { 
                limit: 12000, 
                name: "Salt",           
                color: "#eeeeee", 
                particle: "#ffffff", 
                hardness: 1.0, 
                abrasiveness: 0.8, 
                driftTendency: 0.7,
                lossZone: { start: 9500, end: 9700, maxMW: 13.0, maxLossRate: 400 },
                kickZone: { start: 10500, end: 10800, minMW: 12.5 }
            },
            { 
                limit: 15001, 
                name: "Deep Reservoir", 
                color: "#1b5e20", 
                particle: "#4caf50", 
                hardness: 0.8, 
                abrasiveness: 0.7, 
                driftTendency: -0.2,
                lossZone: null,
                kickZone: { start: 13000, end: 13500, minMW: 13.5 }
            }
        ],
        normalPressureMW: 12.0
    },
    
    shallowLand: {
        name: "Shallow Land",
        targetDepth: 5000,
        targetPath: [
            { depth: 0,    x: 400 },
            { depth: 1500, x: 400 },
            { depth: 3500, x: 480 },
            { depth: 5000, x: 480 }
        ],
        formations: [
            { 
                limit: 800,   
                name: "Topsoil",        
                color: "#5d4037", 
                particle: "#795548", 
                hardness: 0.25, 
                abrasiveness: 0.1, 
                driftTendency: 0.2,
                lossZone: null,
                kickZone: null
            },
            { 
                limit: 2000,  
                name: "Clay",           
                color: "#6d4c41", 
                particle: "#8d6e63", 
                hardness: 0.4, 
                abrasiveness: 0.3, 
                driftTendency: -0.3,
                lossZone: { start: 1200, end: 1300, maxMW: 10.5, maxLossRate: 150 },
                kickZone: null
            },
            { 
                limit: 3500,  
                name: "Sandstone",      
                color: "#8d6e63", 
                particle: "#bcaaa4", 
                hardness: 0.6, 
                abrasiveness: 0.8, 
                driftTendency: 0.5,
                lossZone: null,
                kickZone: null
            },
            { 
                limit: 5001,  
                name: "Limestone",      
                color: "#9e9e9e", 
                particle: "#bdbdbd", 
                hardness: 1.5, 
                abrasiveness: 1.2, 
                driftTendency: -0.6,
                lossZone: { start: 4200, end: 4350, maxMW: 11.0, maxLossRate: 180 },
                kickZone: null
            }
        ],
        normalPressureMW: 9.0
    }
};
