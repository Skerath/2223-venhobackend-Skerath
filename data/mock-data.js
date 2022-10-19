let INGREDIENTS = [
    {
        id: 1,
        name: "Leather",
        modifiers: {
            walk_speed: 0.02,
            durability: -17
        },
        level_requirement: 2,
        uses: ["Armouring, Tailoring"]
    },
    {
        id: 2,
        name: "Brown Mushroom",
        modifiers: {
            health: {
                min: 3,
                max: 5
            },
            durability: -36
        },
        level_requirement: 1,
        uses: ["Armouring"]
    },
    {
        id: 3,
        name: "Crawler Eye",
        modifiers: {
            walk_speed: {
                min: 0.03,
                max: 0.05
            },
            xp_bonus: {
                min: 0.04,
                max: 0.07
            },
            durability: -54
        },
        level_requirement: 2,
        uses: ["Alchemism"]
    }
]

module.exports = {INGREDIENTS};