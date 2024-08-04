const iconMap = ["comm", "four", "cross", "retry", "sad", "bell", "page", "search", "zero"],
      icon_width = 79,
      icon_height = 79,
      num_icons = 9,
      time_per_icon = 100,
      indexes = [0, 0, 0];

const defaultCombination = [iconMap.indexOf("zero"), iconMap.indexOf("four"), iconMap.indexOf("zero")];

// Roll one reel
const roll = (reel, offset = 0) => {
    const delta = (offset + 2) * num_icons + Math.round(Math.random() * num_icons);

    return new Promise((resolve, reject) => {
        const style = getComputedStyle(reel),
              backgroundPositionY = parseFloat(style["background-position-y"]),
              targetBackgroundPositionY = backgroundPositionY + delta * icon_height,
              normTargetBackgroundPositionY = targetBackgroundPositionY % (num_icons * icon_height);

        setTimeout(() => {
            reel.style.transition = `background-position-y ${(8 + 1 * delta) * time_per_icon}ms cubic-bezier(.41,-0.01,.63,1.09)`;
            reel.style.backgroundPositionY = `${backgroundPositionY + delta * icon_height}px`;
        }, offset * 150);

        setTimeout(() => {
            reel.style.transition = `none`;
            reel.style.backgroundPositionY = `${normTargetBackgroundPositionY}px`;
            resolve(normTargetBackgroundPositionY / icon_height % num_icons);
        }, (8 + 1 * delta) * time_per_icon + offset * 150);
    });
};

// Roll all reels and handle win conditions
function rollAll() {
    const reelsList = document.querySelectorAll('.slots > .reel');

    Promise
        .all([...reelsList].map((reel, i) => roll(reel, i)))
        .then((deltas) => {
            // Update indexes based on deltas
            deltas.forEach((delta, i) => indexes[i] = delta);
            console.log('Indexes:', indexes); // Debugging line

            // Win conditions
            if (indexes[0] === indexes[1] || indexes[1] === indexes[2]) {
                const winCls = indexes[0] === indexes[2] ? "win2" : "win1";
                document.querySelector(".slots").classList.add(winCls);
                setTimeout(() => document.querySelector(".slots").classList.remove(winCls), 2000);
            }

            // Roll again
            setTimeout(rollAll, 3000);
        });
};

window.onload = () => {
    const reelsList = document.querySelectorAll('.slots > .reel');
    
    reelsList.forEach((reel, i) => {
        reel.style.backgroundPositionY = `-${defaultCombination[i] * icon_height}px`;
        indexes[i] = defaultCombination[i]; // Set the index to match the default combination
    });

    // Start rolling after a delay
    setTimeout(rollAll, 3000);
};
