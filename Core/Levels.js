import LevelsList from '../Assets/Levels/Levels';
import Cinematics from '../Assets/Cinematics/Cinematics';

const Levels = [
    {
        type: "cinematic",
        name: "Intro",
        data: Cinematics.intro
    },
    {
        type: "level",
        name: "one",
        data: LevelsList.C1_L1
    }
]

export default Levels;
