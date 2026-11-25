/**
 * Category prompts for Interstellar.
 *
 * Each prompt lists accepted answers grouped into five rarity tiers
 * (index 0 = everyday/obvious → index 4 = the rarest deep cuts).
 * An entry may carry aliases separated by "/": the first spelling is the one
 * shown to players, the rest are also accepted.
 *
 * The hidden trap and the single FTL answer are NOT stored here: both are drawn
 * from a seed made of the game day and the prompt id (see dailyRounds). The
 * rarest tier here is the pool the day's one FTL answer is drawn from.
 */

export interface Prompt {
  id: string
  category: string
  /** Five tiers of answers, obvious → obscure. */
  tiers: [string[], string[], string[], string[], string[]]
}

export const PROMPTS: Prompt[] = [
  {
    id: 'moons',
    category: 'Moons in our solar system',
    tiers: [
      ['The Moon/moon/luna/earths moon', 'Titan', 'Europa'],
      ['Ganymede', 'Io', 'Phobos', 'Callisto', 'Deimos'],
      ['Enceladus', 'Triton', 'Charon', 'Oberon', 'Titania', 'Miranda'],
      ['Mimas', 'Iapetus', 'Rhea', 'Dione', 'Tethys', 'Ariel', 'Umbriel', 'Nereid', 'Hyperion', 'Amalthea', 'Proteus'],
      ['Himalia', 'Thebe', 'Metis', 'Adrastea', 'Phoebe', 'Janus', 'Epimetheus', 'Pandora', 'Prometheus', 'Pan', 'Atlas', 'Larissa', 'Galatea', 'Despina', 'Thalassa', 'Naiad', 'Puck', 'Cordelia', 'Ophelia', 'Sycorax', 'Caliban', 'Dysnomia', 'Hydra', 'Nix', 'Kerberos/cerberus', 'Styx', 'Leda', 'Elara', 'Pasiphae', 'Carme', 'Ananke', 'Sinope', 'Lysithea', 'Halimede', 'Psamathe', 'Sao', 'Neso', "Hi'iaka/hiiaka", 'Namaka', 'Weywot', 'Vanth'],
    ],
  },
  {
    id: 'dogs',
    category: 'Dog breeds',
    tiers: [
      ['Labrador Retriever/labrador/lab', 'Golden Retriever', 'German Shepherd', 'Poodle', 'Bulldog/english bulldog', 'Beagle', 'Chihuahua'],
      ['Siberian Husky/husky', 'Dachshund/wiener dog/sausage dog', 'Boxer', 'Rottweiler', 'Pug', 'Corgi/pembroke welsh corgi/welsh corgi', 'Shih Tzu', 'Great Dane', 'Border Collie', 'Yorkshire Terrier/yorkie', 'Doberman/doberman pinscher', 'Dalmatian', 'Pomeranian', 'French Bulldog/frenchie'],
      ['Shiba Inu', 'Akita', 'Greyhound', 'Whippet', 'Bernese Mountain Dog', 'Saint Bernard/st bernard', 'Maltese', 'Cocker Spaniel', 'Mastiff', 'Bloodhound', 'Basset Hound', 'Samoyed', 'Newfoundland', 'Weimaraner', 'Vizsla', 'Alaskan Malamute/malamute', 'Australian Shepherd/aussie', 'Cavalier King Charles Spaniel/cavalier', 'Bichon Frise', 'Jack Russell Terrier/jack russell', 'Pit Bull/pitbull/american pit bull terrier', 'Schnauzer', 'Collie/rough collie', 'Chow Chow', 'Shar Pei', 'Papillon', 'Boston Terrier', 'Havanese', 'Pekingese'],
      ['Basenji', 'Rhodesian Ridgeback', 'Afghan Hound', 'Borzoi', 'Saluki', 'Bull Terrier', 'Irish Wolfhound', 'Great Pyrenees', 'Leonberger', 'Komondor', 'Puli', 'Keeshond', 'Lhasa Apso', 'Shetland Sheepdog/sheltie', 'Bedlington Terrier', 'Kuvasz', 'Cane Corso', 'Dogue de Bordeaux', 'Belgian Malinois/malinois', 'Xoloitzcuintli/xolo', 'Pharaoh Hound', 'Norwegian Elkhound', 'Tibetan Mastiff'],
      ['Otterhound', 'Lagotto Romagnolo', 'Azawakh', 'Mudi', 'Norwegian Lundehund/lundehund', 'Catahoula Leopard Dog/catahoula', 'Sloughi', 'Kooikerhondje', 'Stabyhoun', 'Thai Ridgeback', 'Chinook', 'Bergamasco', 'Plott Hound', 'Treeing Walker Coonhound', 'Kai Ken', 'Jindo', 'Peruvian Inca Orchid', 'Spinone Italiano', 'Sealyham Terrier', 'Dandie Dinmont Terrier', 'Cesky Terrier', 'Glen of Imaal Terrier', 'Skye Terrier'],
    ],
  },
  {
    id: 'africa',
    category: 'Countries in Africa',
    tiers: [
      ['Egypt', 'South Africa', 'Nigeria', 'Kenya'],
      ['Morocco', 'Ethiopia', 'Ghana', 'Algeria', 'Libya', 'Somalia', 'Sudan', 'Madagascar', 'Tanzania'],
      ['Uganda', 'Zimbabwe', 'Rwanda', 'Democratic Republic of the Congo/drc/dr congo/congo/zaire', 'Senegal', 'Cameroon', 'Tunisia', 'Angola', 'Mali', 'Zambia', 'Mozambique', 'Namibia', 'Botswana', "Ivory Coast/cote d'ivoire", 'Niger', 'Chad', 'South Sudan'],
      ['Malawi', 'Liberia', 'Sierra Leone', 'Gabon', 'Guinea', 'Burkina Faso', 'Benin', 'Togo', 'Mauritania', 'Eritrea', 'Djibouti', 'Lesotho', 'Burundi', 'Central African Republic/car', 'Gambia/the gambia', 'Mauritius'],
      ['Eswatini/swaziland', 'Equatorial Guinea', 'Guinea-Bissau', 'Cape Verde/cabo verde', 'Comoros', 'Seychelles', 'Sao Tome and Principe', 'Republic of the Congo/congo brazzaville'],
    ],
  },
  {
    id: 'elements',
    category: 'Elements on the periodic table',
    tiers: [
      ['Oxygen', 'Hydrogen', 'Carbon', 'Gold', 'Iron', 'Helium', 'Silver', 'Nitrogen'],
      ['Copper', 'Sodium', 'Calcium', 'Aluminum/aluminium', 'Lead', 'Zinc', 'Uranium', 'Neon', 'Chlorine', 'Potassium', 'Platinum', 'Mercury', 'Lithium', 'Sulfur/sulphur', 'Silicon', 'Magnesium', 'Tin'],
      ['Titanium', 'Nickel', 'Phosphorus', 'Fluorine', 'Iodine', 'Plutonium', 'Argon', 'Cobalt', 'Chromium', 'Tungsten', 'Radon', 'Radium', 'Krypton', 'Xenon', 'Boron', 'Manganese', 'Arsenic'],
      ['Beryllium', 'Cesium/caesium', 'Barium', 'Bismuth', 'Cadmium', 'Gallium', 'Germanium', 'Selenium', 'Strontium', 'Vanadium', 'Palladium', 'Osmium', 'Iridium', 'Thorium', 'Francium', 'Antimony', 'Bromine', 'Rubidium', 'Polonium', 'Tellurium', 'Zirconium', 'Molybdenum', 'Indium', 'Americium', 'Einsteinium', 'Californium', 'Neodymium'],
      ['Hafnium', 'Rhenium', 'Rhodium', 'Ruthenium', 'Technetium', 'Niobium', 'Tantalum', 'Scandium', 'Yttrium', 'Lanthanum', 'Cerium', 'Praseodymium', 'Promethium', 'Samarium', 'Europium', 'Gadolinium', 'Terbium', 'Dysprosium', 'Holmium', 'Erbium', 'Thulium', 'Ytterbium', 'Lutetium', 'Thallium', 'Astatine', 'Actinium', 'Protactinium', 'Neptunium', 'Curium', 'Berkelium', 'Fermium', 'Mendelevium', 'Nobelium', 'Lawrencium', 'Rutherfordium', 'Dubnium', 'Seaborgium', 'Bohrium', 'Hassium', 'Meitnerium', 'Darmstadtium', 'Roentgenium', 'Copernicium', 'Nihonium', 'Flerovium', 'Moscovium', 'Livermorium', 'Tennessine', 'Oganesson'],
    ],
  },
  {
    id: 'shakespeare',
    category: 'Plays by Shakespeare',
    tiers: [
      ['Romeo and Juliet', 'Hamlet', 'Macbeth'],
      ['Othello', 'King Lear', "A Midsummer Night's Dream/midsummer nights dream/midsummer", 'Julius Caesar', 'The Tempest', 'Much Ado About Nothing'],
      ['Twelfth Night', 'The Merchant of Venice', 'The Taming of the Shrew', 'As You Like It', 'Richard III', 'Henry V', 'Antony and Cleopatra'],
      ["The Winter's Tale", 'Henry IV', 'Coriolanus', 'Titus Andronicus', 'The Comedy of Errors', 'Measure for Measure', 'Richard II', 'The Merry Wives of Windsor', "Love's Labour's Lost/loves labors lost", "All's Well That Ends Well", 'Troilus and Cressida', 'Cymbeline', 'Henry VIII', 'King John'],
      ['Pericles', 'Timon of Athens', 'The Two Gentlemen of Verona', 'Henry VI', 'The Two Noble Kinsmen', 'Edward III'],
    ],
  },
  {
    id: 'pizza',
    category: 'Pizza toppings',
    tiers: [
      ['Pepperoni', 'Cheese/mozzarella', 'Mushrooms/mushroom', 'Sausage'],
      ['Onions/onion', 'Peppers/bell peppers/green peppers/pepper', 'Olives/black olives/olive', 'Pineapple', 'Ham', 'Bacon', 'Tomatoes/tomato', 'Spinach'],
      ['Jalapeños/jalapenos/jalapeno', 'Chicken', 'Basil', 'Garlic', 'Anchovies/anchovy', 'Ground Beef/beef', 'Feta', 'Meatballs/meatball', 'Parmesan', 'Ricotta', 'Banana Peppers', 'Salami'],
      ['Artichoke', 'Prosciutto', 'Arugula/rocket', 'Sun-dried Tomatoes', 'Goat Cheese', 'Pesto', 'Gorgonzola', 'Capers', 'Eggplant/aubergine', 'Zucchini/courgette', 'Broccoli', 'Corn/sweetcorn', 'Egg', 'Shrimp/prawns', 'BBQ Sauce/barbecue sauce', 'Red Onion', 'Hot Honey', 'Chorizo', 'Pancetta'],
      ["'Nduja/nduja", 'Soppressata', 'Burrata', 'Calabrian Chili', 'Figs/fig', 'Truffle', 'Clams', 'Potato', 'Kimchi', 'Mortadella', 'Pistachio', 'Speck', 'Guanciale', 'Taleggio', 'Fontina', 'Brussels Sprouts', 'Squid/calamari', 'Tuna', 'Caramelized Onions', 'Pear'],
    ],
  },
  {
    id: 'instruments',
    category: 'Musical instruments',
    tiers: [
      ['Piano', 'Guitar', 'Drums/drum', 'Violin', 'Trumpet', 'Flute'],
      ['Saxophone/sax', 'Cello', 'Clarinet', 'Bass Guitar/bass', 'Harp', 'Trombone', 'Ukulele', 'Harmonica', 'Keyboard', 'Tuba', 'Banjo', 'Accordion'],
      ['Oboe', 'Viola', 'French Horn/horn', 'Xylophone', 'Tambourine', 'Bagpipes', 'Organ', 'Bassoon', 'Mandolin', 'Triangle', 'Piccolo', 'Double Bass/upright bass/contrabass', 'Cymbals', 'Recorder', 'Synthesizer/synth', 'Glockenspiel'],
      ['Sitar', 'Didgeridoo', 'Marimba', 'Harpsichord', 'Bongos', 'Congas', 'Steel Drum/steel pan/steelpan', 'Kazoo', 'Theremin', 'Lute', 'Euphonium', 'Cornet', 'Timpani', 'Djembe', 'Tabla', 'Ocarina', 'Vibraphone', 'Castanets', 'Lyre', 'Zither', 'Bugle', 'Mellophone', 'Dulcimer', 'Celesta'],
      ['Hurdy-gurdy', 'Erhu', 'Koto', 'Shamisen', 'Oud', 'Balalaika', 'Bouzouki', 'Kalimba/thumb piano', 'Mbira', 'Shakuhachi', 'Sousaphone', 'Sackbut', 'Crumhorn', 'Handpan/hang drum', 'Guzheng', 'Pipa', 'Bandoneon', 'Theorbo', 'Glass Harmonica', 'Cajón/cajon', 'Tanpura', 'Sarod', 'Duduk', 'Kora', 'Nyckelharpa', 'Charango', 'Ondes Martenot', 'Contrabassoon', 'Flugelhorn', 'Washboard', 'Clavichord'],
    ],
  },
  {
    id: 'greek',
    category: 'Greek gods, goddesses & Titans',
    tiers: [
      ['Zeus', 'Poseidon', 'Hades', 'Athena', 'Aphrodite', 'Apollo'],
      ['Hera', 'Ares', 'Hermes', 'Artemis', 'Dionysus', 'Hephaestus', 'Demeter', 'Cronus/kronos'],
      ['Persephone', 'Hestia', 'Eros', 'Nike', 'Gaia/gaea', 'Helios', 'Pan', 'Uranus/ouranos', 'Atlas', 'Prometheus', 'Hecate', 'Nemesis', 'Morpheus'],
      ['Selene', 'Eos', 'Iris', 'Hypnos', 'Thanatos', 'Rhea', 'Hebe', 'Nyx', 'Tyche', 'Asclepius', 'Eris', 'Oceanus', 'Hyperion', 'Themis', 'Mnemosyne', 'Phobos', 'Deimos', 'Boreas', 'Zephyrus', 'Triton', 'Harmonia'],
      ['Erebus', 'Chaos', 'Tartarus', 'Pontus', 'Aether', 'Hemera', 'Metis', 'Leto', 'Dione', 'Coeus', 'Phoebe', 'Tethys', 'Iapetus', 'Crius', 'Theia', 'Epimetheus', 'Ananke', 'Chronos', 'Nereus', 'Proteus', 'Amphitrite', 'Enyo', 'Peitho', 'Eileithyia', 'Notus', 'Eurus', 'Priapus', 'Aristaeus', 'Plutus'],
    ],
  },
  {
    id: 'fruits',
    category: 'Fruits',
    tiers: [
      ['Apple', 'Banana', 'Orange', 'Strawberry', 'Grape'],
      ['Mango', 'Pineapple', 'Watermelon', 'Peach', 'Pear', 'Cherry', 'Blueberry', 'Lemon', 'Kiwi/kiwifruit'],
      ['Plum', 'Raspberry', 'Lime', 'Grapefruit', 'Papaya', 'Coconut', 'Pomegranate', 'Cantaloupe', 'Blackberry', 'Apricot', 'Avocado', 'Fig', 'Nectarine', 'Cranberry', 'Tangerine/mandarin', 'Honeydew', 'Tomato'],
      ['Passion Fruit', 'Dragon Fruit/pitaya', 'Lychee/litchi', 'Guava', 'Persimmon', 'Kumquat', 'Date', 'Clementine', 'Gooseberry', 'Elderberry', 'Starfruit/carambola', 'Jackfruit', 'Durian', 'Quince', 'Mulberry', 'Boysenberry', 'Plantain', 'Olive', 'Currant', 'Huckleberry', 'Pomelo'],
      ['Rambutan', 'Mangosteen', 'Longan', 'Loquat', 'Feijoa', 'Soursop/guanabana', 'Cherimoya', 'Tamarind', 'Salak/snake fruit', 'Ackee', 'Breadfruit', 'Jabuticaba', 'Pawpaw', 'Medlar', 'Yuzu', "Buddha's Hand", 'Sapodilla', 'Marula', 'Cloudberry', 'Lingonberry', 'Physalis/ground cherry/cape gooseberry', 'Pitanga', 'Langsat', 'Santol', 'Bilberry', 'Miracle Fruit', 'Ugli Fruit'],
    ],
  },
  {
    id: 'states',
    category: 'U.S. states',
    tiers: [
      ['California', 'Texas', 'Florida', 'New York'],
      ['Washington', 'Hawaii', 'Alaska', 'Arizona', 'Nevada', 'Georgia', 'Illinois', 'Ohio', 'Colorado', 'Michigan', 'Pennsylvania', 'Massachusetts', 'New Jersey'],
      ['Oregon', 'Utah', 'Tennessee', 'Virginia', 'North Carolina', 'South Carolina', 'Louisiana', 'Minnesota', 'Wisconsin', 'Kentucky', 'Alabama', 'Missouri', 'Indiana', 'Maryland', 'Oklahoma', 'Kansas', 'Maine', 'Iowa'],
      ['New Mexico', 'Mississippi', 'Arkansas', 'Nebraska', 'Idaho', 'Montana', 'Connecticut', 'Vermont', 'New Hampshire', 'West Virginia', 'Wyoming', 'Delaware', 'Rhode Island'],
      ['North Dakota', 'South Dakota'],
    ],
  },
  {
    id: 'boardgames',
    category: 'Board games',
    tiers: [
      ['Monopoly', 'Chess', 'Scrabble', 'Checkers/draughts', 'Clue/cluedo'],
      ['Sorry!/sorry', 'Risk', 'Candy Land/candyland', 'Battleship', 'Connect Four/connect 4', 'Trivial Pursuit', 'The Game of Life/game of life/life', 'Operation', 'Catan/settlers of catan', 'Chutes and Ladders/snakes and ladders', 'Pictionary', 'Backgammon', 'Guess Who'],
      ['Ticket to Ride', 'Pandemic', 'Mouse Trap/mousetrap', 'Stratego', 'Othello/reversi', 'Mancala', 'Boggle', 'Yahtzee', 'Go/baduk/weiqi', 'Mastermind', 'Hungry Hungry Hippos', 'Trouble', 'Parcheesi/ludo', 'Codenames', 'Taboo', 'Scattergories', 'Twister', 'Cranium', 'Mahjong/mahjongg'],
      ['Carcassonne', 'Azul', 'Dominion', 'Splendor', 'Wingspan', '7 Wonders/seven wonders', 'Gloomhaven', 'Terraforming Mars', 'Dixit', 'Axis & Allies/axis and allies', 'Diplomacy', 'Blokus', 'Sequence', 'Rummikub', 'Kingdomino', 'Small World', 'King of Tokyo', 'Betrayal at House on the Hill', 'Arkham Horror', 'Twilight Imperium', 'Agricola', 'Puerto Rico', 'Power Grid', 'Shogi'],
      ['Brass', 'Twilight Struggle', 'Root', 'Spirit Island', 'Scythe', 'El Grande', 'Tigris & Euphrates/tigris and euphrates', 'Hive', 'Patchwork', 'Onitama', "Tzolk'in/tzolkin", 'Caylus', 'Le Havre', 'Through the Ages', 'Hanabi', 'Xiangqi/chinese chess', 'Senet', 'Hnefatafl', "Nine Men's Morris", 'Pachisi', 'Crokinole', 'Acquire', 'Cosmic Encounter', 'Galaxy Trucker', 'Mysterium'],
    ],
  },
  {
    id: 'constellations',
    category: 'Constellations',
    tiers: [
      ['Orion', 'Ursa Major/big dipper/great bear'],
      ['Ursa Minor/little dipper/little bear', 'Cassiopeia', 'Leo', 'Scorpius/scorpio', 'Gemini', 'Taurus', 'Aries', 'Cancer', 'Virgo', 'Libra', 'Sagittarius', 'Capricornus/capricorn', 'Aquarius', 'Pisces'],
      ['Andromeda', 'Pegasus', 'Draco', 'Cygnus', 'Perseus', 'Hercules', 'Lyra', 'Crux/southern cross', 'Aquila', 'Canis Major'],
      ['Centaurus', 'Boötes/bootes', 'Cepheus', 'Auriga', 'Hydra', 'Ophiuchus', 'Corona Borealis', 'Canis Minor', 'Lepus', 'Monoceros', 'Eridanus', 'Phoenix', 'Delphinus', 'Carina', 'Corvus', 'Pavo', 'Cetus'],
      ['Camelopardalis', 'Lynx', 'Vulpecula', 'Sagitta', 'Lacerta', 'Triangulum', 'Sculptor', 'Fornax', 'Pyxis', 'Antlia', 'Microscopium', 'Telescopium', 'Octans', 'Mensa', 'Volans', 'Dorado', 'Pictor', 'Caelum', 'Horologium', 'Reticulum', 'Norma', 'Circinus', 'Musca', 'Chamaeleon', 'Apus', 'Tucana', 'Indus', 'Grus', 'Puppis', 'Vela', 'Columba', 'Equuleus', 'Scutum', 'Serpens', 'Leo Minor', 'Coma Berenices', 'Canes Venatici', 'Crater', 'Sextans', 'Lupus', 'Ara', 'Corona Australis', 'Piscis Austrinus', 'Hydrus'],
    ],
  },
  {
    id: 'olympics',
    category: 'Olympic sports (past or present)',
    tiers: [
      ['Swimming', 'Gymnastics', 'Track and Field/athletics/track/running', 'Basketball', 'Soccer/football'],
      ['Tennis', 'Volleyball', 'Boxing', 'Diving', 'Cycling', 'Wrestling', 'Rowing', 'Skiing/alpine skiing', 'Figure Skating', 'Ice Hockey/hockey', 'Snowboarding'],
      ['Fencing', 'Archery', 'Judo', 'Taekwondo', 'Weightlifting', 'Sailing', 'Surfing', 'Skateboarding', 'Golf', 'Rugby/rugby sevens', 'Handball', 'Water Polo', 'Equestrian/dressage/show jumping', 'Triathlon', 'Badminton', 'Table Tennis/ping pong', 'Speed Skating', 'Bobsleigh/bobsled', 'Curling'],
      ['Canoeing/kayaking/canoe/kayak', 'Shooting', 'Luge', 'Skeleton', 'Biathlon', 'Modern Pentathlon', 'Field Hockey', 'Beach Volleyball', 'Trampoline', 'Artistic Swimming/synchronized swimming', 'BMX', 'Sport Climbing/climbing', 'Karate', 'Breaking/breakdancing', 'Softball', 'Baseball', 'Ski Jumping', 'Nordic Combined', 'Short Track', 'Freestyle Skiing', 'Mountain Biking'],
      ['Tug of War', 'Cricket', 'Lacrosse', 'Polo', 'Croquet', 'Jeu de Paume', 'Basque Pelota/pelota', 'Roque', 'Motorboating', 'Art Competitions', 'Rope Climbing', 'Military Patrol', 'Rackets', 'Live Pigeon Shooting', 'Plunge for Distance'],
    ],
  },
  {
    id: 'pasta',
    category: 'Pasta shapes',
    tiers: [
      ['Spaghetti', 'Penne', 'Macaroni', 'Lasagna/lasagne', 'Fettuccine/fettucine'],
      ['Ravioli', 'Linguine', 'Rigatoni', 'Farfalle/bow tie/bowtie', 'Rotini', 'Tortellini', 'Ziti', 'Angel Hair/capellini', 'Gnocchi', 'Orzo'],
      ['Fusilli', 'Shells/conchiglie', 'Tagliatelle', 'Pappardelle', 'Orecchiette', 'Manicotti', 'Cannelloni', 'Vermicelli', 'Bucatini', 'Cavatappi', 'Ditalini', 'Gemelli', 'Rotelle/wagon wheels'],
      ['Campanelle', 'Radiatori', 'Paccheri', 'Cavatelli', 'Mafaldine/mafalda', 'Strozzapreti', 'Trofie', 'Casarecce', 'Anelli', 'Stelline', 'Acini di Pepe', 'Agnolotti', 'Tortelloni', 'Perciatelli', 'Lumache', 'Fregola', 'Pastina'],
      ['Corzetti', 'Lorighittas', 'Busiate', 'Pici', 'Garganelli', 'Malloreddus', 'Filei', 'Cappelletti', 'Culurgiones', 'Sorpresine', 'Scialatielli', 'Bigoli', 'Testaroli', 'Su Filindeu', 'Calamarata', 'Gigli', 'Strangozzi', 'Maltagliati', 'Passatelli'],
    ],
  },
  {
    id: 'consoles',
    category: 'Video game consoles',
    tiers: [
      ['PlayStation/ps1/playstation 1', 'Xbox', 'Nintendo Switch/switch'],
      ['Wii', 'Game Boy/gameboy', 'PlayStation 2/ps2', 'PlayStation 4/ps4', 'PlayStation 5/ps5', 'Nintendo 64/n64', 'Xbox 360', 'Nintendo DS/ds', 'GameCube', 'NES/nintendo entertainment system'],
      ['Super Nintendo/snes', 'Xbox One', 'PlayStation 3/ps3', 'PSP/playstation portable', 'Wii U', 'Nintendo 3DS/3ds', 'Sega Genesis/genesis/mega drive', 'Atari 2600', 'Game Boy Advance/gba', 'Xbox Series X/series x', 'Dreamcast', 'PS Vita/vita', 'Steam Deck'],
      ['Sega Saturn/saturn', 'Game Gear', 'Atari Lynx/lynx', 'Neo Geo', 'Virtual Boy', 'TurboGrafx-16/turbografx/pc engine', 'Sega Master System/master system', 'Game Boy Color', 'ColecoVision', 'Intellivision', 'Atari Jaguar/jaguar', 'Sega CD/mega cd', 'Sega 32X/32x', 'Ouya', 'N-Gage', 'Magnavox Odyssey/odyssey'],
      ['3DO', 'Philips CD-i/cdi', 'Vectrex', 'Fairchild Channel F/channel f', 'WonderSwan', 'Apple Pippin/pippin', 'Neo Geo Pocket', 'Nuon', 'Tiger Game.com/gamecom', 'Atari 5200', 'Atari 7800', 'Pokémon Mini/pokemon mini', 'Gizmondo', 'Playdate', 'Amiga CD32/cd32', 'FM Towns Marty', 'Bally Astrocade/astrocade', 'PC-FX', 'Sega Pico', 'Evercade'],
    ],
  },
  {
    id: 'australia',
    category: 'Animals native to Australia',
    tiers: [
      ['Kangaroo', 'Koala', 'Platypus', 'Emu', 'Wombat'],
      ['Dingo', 'Tasmanian Devil', 'Kookaburra', 'Wallaby', 'Echidna', 'Saltwater Crocodile/crocodile/croc', 'Cassowary'],
      ['Quokka', 'Sugar Glider', 'Possum/brushtail possum', 'Bandicoot', 'Frilled Lizard/frilled neck lizard', 'Cockatoo', 'Galah', 'Box Jellyfish', 'Funnel-web Spider/funnel web', 'Taipan', 'Bilby', 'Lyrebird', 'Thorny Devil', 'Numbat', 'Quoll'],
      ['Tree Kangaroo', 'Wallaroo', 'Pademelon', 'Bettong', 'Potoroo', 'Bowerbird', 'Eastern Brown Snake/brown snake', 'Redback Spider/redback', 'Blue-tongued Lizard/blue tongue skink/bluetongue', 'Goanna', 'Australian Magpie/magpie', 'Budgerigar/budgie', 'Rainbow Lorikeet/lorikeet', 'Black Swan', 'Thylacine/tasmanian tiger', 'Dugong', 'Flying Fox/fruit bat', 'Weedy Sea Dragon/sea dragon'],
      ['Kowari', 'Dunnart', 'Antechinus', 'Mulgara', 'Cuscus', 'Brolga', 'Jabiru', 'Tawny Frogmouth', 'Malleefowl', 'Gouldian Finch', 'Hairy-nosed Wombat', 'Ningaui', 'Planigale', 'Woylie', 'Rakali', 'Corroboree Frog', 'Perentie', 'Little Penguin/fairy penguin', "Leadbeater's Possum", 'Honey Possum', 'Kultarr', 'Pygmy Possum', 'Bush Stone-curlew', 'Gang-gang Cockatoo'],
    ],
  },
  {
    id: 'painters',
    category: 'Famous painters',
    tiers: [
      ['Leonardo da Vinci/da vinci/leonardo', 'Pablo Picasso/picasso', 'Vincent van Gogh/van gogh', 'Michelangelo', 'Claude Monet/monet'],
      ['Rembrandt', 'Salvador Dalí/dali/salvador dali', 'Frida Kahlo/kahlo/frida', 'Andy Warhol/warhol', 'Raphael', 'Pierre-Auguste Renoir/renoir', 'Henri Matisse/matisse', 'Jackson Pollock/pollock', "Georgia O'Keeffe/okeeffe/o keeffe", 'Bob Ross', 'Banksy'],
      ['Paul Cézanne/cezanne', 'Edgar Degas/degas', 'Edvard Munch/munch', 'Gustav Klimt/klimt', 'Johannes Vermeer/vermeer', 'Sandro Botticelli/botticelli', 'Caravaggio', 'Francisco Goya/goya', 'Édouard Manet/manet', 'Georges Seurat/seurat', 'Mark Rothko/rothko', 'Paul Gauguin/gauguin', 'Wassily Kandinsky/kandinsky', 'René Magritte/magritte', 'Edward Hopper/hopper', 'Norman Rockwell/rockwell', 'Jean-Michel Basquiat/basquiat', 'Roy Lichtenstein/lichtenstein', 'Titian', 'J. M. W. Turner/turner', 'James McNeill Whistler/whistler', 'Keith Haring/haring'],
      ['Piet Mondrian/mondrian', 'Paul Klee/klee', 'Marc Chagall/chagall', 'Henri de Toulouse-Lautrec/toulouse lautrec', 'Hieronymus Bosch/bosch', 'Pieter Bruegel/bruegel/brueghel', 'El Greco', 'Jan van Eyck/van eyck', 'Albrecht Dürer/durer/albrecht durer', 'Diego Velázquez/velazquez', 'Peter Paul Rubens/rubens', 'John Constable/constable', 'Eugène Delacroix/delacroix', 'Gustave Courbet/courbet', 'Amedeo Modigliani/modigliani', 'Egon Schiele/schiele', 'Joan Miró/miro', 'Francis Bacon', 'David Hockney/hockney', 'Mary Cassatt/cassatt', 'Andrew Wyeth/wyeth', 'Grant Wood', 'Diego Rivera/rivera', 'Katsushika Hokusai/hokusai', 'Caspar David Friedrich/friedrich', 'John Singer Sargent/sargent', 'Frans Hals', 'Lucian Freud', 'Gerhard Richter/richter', 'Yayoi Kusama/kusama'],
      ['Artemisia Gentileschi/gentileschi/artemisia', 'Hilma af Klint/af klint', 'Giotto', 'Fra Angelico', 'Piero della Francesca', 'Tintoretto', 'Paolo Veronese/veronese', 'Canaletto', 'Jean-Honoré Fragonard/fragonard', 'Antoine Watteau/watteau', 'Jean-Auguste-Dominique Ingres/ingres', 'Théodore Géricault/gericault', 'Camille Corot/corot', 'Jean-François Millet/millet', 'Camille Pissarro/pissarro', 'Alfred Sisley/sisley', 'Berthe Morisot/morisot', 'Pierre Bonnard/bonnard', 'Édouard Vuillard/vuillard', 'Paul Signac/signac', 'Odilon Redon/redon', 'Gustave Moreau/moreau', 'James Ensor/ensor', 'Vilhelm Hammershøi/hammershoi', 'Ilya Repin/repin', 'Tamara de Lempicka/lempicka', 'Leonora Carrington/carrington', 'Remedios Varo/varo', 'Agnes Martin', 'Helen Frankenthaler/frankenthaler', 'Lee Krasner/krasner', 'Cy Twombly/twombly', 'Arshile Gorky/gorky', 'Clyfford Still', 'Rosa Bonheur/bonheur', 'Élisabeth Vigée Le Brun/vigee le brun', 'Hans Holbein/holbein', 'Lucas Cranach/cranach', 'Hans Memling/memling', 'Rogier van der Weyden/van der weyden', 'Andrea Mantegna/mantegna', 'Paolo Uccello/uccello', 'Masaccio', 'Giovanni Bellini/bellini', 'Giorgione', 'Parmigianino', 'Bronzino', 'Francisco de Zurbarán/zurbaran', 'Bartolomé Esteban Murillo/murillo', 'Jean-Baptiste-Siméon Chardin/chardin', 'François Boucher/boucher', 'Thomas Gainsborough/gainsborough', 'Joshua Reynolds/reynolds', 'William Hogarth/hogarth', 'William Blake/blake', 'George Stubbs/stubbs', 'Joaquín Sorolla/sorolla', 'Maurice Utrillo/utrillo', 'Chaim Soutine/soutine', 'Balthus'],
    ],
  },
  { id: 'mountains', category: 'Mountains of the world', tiers: [
    ['Mount Everest/everest', 'Kilimanjaro/mount kilimanjaro', 'Mount Fuji/fuji'],
    ['K2', 'Matterhorn', 'Denali/mckinley/mount mckinley', 'Mont Blanc', 'Mount Rainier/rainier'],
    ['Annapurna', 'Aconcagua', 'Ben Nevis', 'Elbrus/mount elbrus', 'Mount Olympus/olympus', 'Kangchenjunga', 'Eiger', 'Snowdon'],
    ['Lhotse', 'Makalu', 'Nanga Parbat', 'Mount Logan/logan', 'Cotopaxi', 'Chimborazo', 'Mount Cook/aoraki', 'Table Mountain'],
    ['Dhaulagiri', 'Manaslu', 'Cho Oyu', 'Gasherbrum', 'Shishapangma', 'Puncak Jaya/carstensz pyramid', 'Vinson Massif/vinson', 'Ojos del Salado', 'Huascaran']] },
  { id: 'cheese', category: 'Cheeses', tiers: [
    ['Cheddar', 'Mozzarella', 'Swiss', 'Parmesan/parmigiano reggiano'],
    ['Brie', 'Gouda', 'Feta', 'American', 'Provolone', 'Blue cheese/blue', 'Ricotta'],
    ['Camembert', 'Gruyere', 'Havarti', 'Manchego', 'Pepper Jack', 'Monterey Jack', 'Gorgonzola', 'Halloumi', 'Colby'],
    ['Roquefort', 'Stilton', 'Emmental', 'Pecorino', 'Asiago', 'Muenster', 'Paneer', 'Fontina', 'Burrata', 'Mascarpone', 'Edam'],
    ['Taleggio', 'Reblochon', 'Epoisses', 'Limburger', 'Wensleydale', 'Morbier', 'Caerphilly', 'Jarlsberg', 'Comte', 'Raclette', 'Oaxaca', 'Brunost']] },
  { id: 'capitals-europe', category: 'Capital cities of Europe', tiers: [
    ['London', 'Paris', 'Rome', 'Madrid', 'Berlin'],
    ['Athens', 'Dublin', 'Amsterdam', 'Moscow', 'Vienna', 'Lisbon', 'Stockholm'],
    ['Brussels', 'Copenhagen', 'Oslo', 'Prague', 'Warsaw', 'Budapest', 'Helsinki', 'Kyiv/kiev', 'Bern'],
    ['Bucharest', 'Sofia', 'Belgrade', 'Zagreb', 'Reykjavik', 'Edinburgh', 'Monaco', 'Luxembourg', 'Bratislava', 'Sarajevo', 'Minsk'],
    ['Ljubljana', 'Vilnius', 'Riga', 'Tallinn', 'Skopje', 'Tirana', 'Podgorica', 'Pristina', 'Chisinau', 'Valletta', 'Vaduz', 'Andorra la Vella', 'San Marino']] },
  { id: 'birds', category: 'Birds', tiers: [
    ['Eagle', 'Pigeon', 'Parrot', 'Penguin', 'Owl', 'Chicken', 'Duck'],
    ['Crow', 'Robin', 'Flamingo', 'Seagull/gull', 'Swan', 'Hawk', 'Peacock', 'Ostrich', 'Turkey', 'Hummingbird', 'Goose/geese'],
    ['Raven', 'Falcon', 'Pelican', 'Toucan', 'Woodpecker', 'Vulture', 'Sparrow', 'Cardinal', 'Emu', 'Stork', 'Heron', 'Blue Jay/bluejay', 'Canary'],
    ['Kingfisher', 'Albatross', 'Puffin', 'Osprey', 'Magpie', 'Cockatoo', 'Cormorant', 'Cassowary', 'Kestrel', 'Nightingale', 'Finch', 'Wren', 'Quail', 'Pheasant', 'Starling'],
    ['Hoopoe', 'Bittern', 'Shoebill', 'Kakapo', 'Quetzal', 'Hoatzin', 'Frigatebird', 'Lapwing', 'Avocet', 'Dunnock', 'Kookaburra', 'Lyrebird', 'Nuthatch', 'Waxwing', 'Corncrake']] },
  { id: 'spices', category: 'Herbs and spices', tiers: [
    ['Pepper/black pepper', 'Cinnamon', 'Basil', 'Garlic/garlic powder'],
    ['Oregano', 'Paprika', 'Parsley', 'Ginger', 'Cumin', 'Mint', 'Rosemary', 'Thyme', 'Cilantro/coriander'],
    ['Turmeric', 'Nutmeg', 'Cloves', 'Dill', 'Sage', 'Bay Leaf/bay leaves/bay', 'Cayenne/cayenne pepper', 'Vanilla', 'Chives'],
    ['Saffron', 'Cardamom', 'Star Anise', 'Fennel', 'Tarragon', 'Allspice', 'Marjoram', 'Mustard Seed/mustard', 'Caraway', 'Lemongrass'],
    ['Sumac', 'Fenugreek', 'Asafoetida/hing', 'Mace', 'Chervil', 'Lovage', 'Nigella', 'Galangal', 'Savory', 'Grains of Paradise', 'Epazote', 'Ajwain']] },
  { id: 'dinosaurs', category: 'Dinosaurs', tiers: [
    ['Tyrannosaurus Rex/t rex/tyrannosaurus', 'Triceratops', 'Velociraptor/raptor'],
    ['Stegosaurus', 'Brachiosaurus', 'Spinosaurus', 'Ankylosaurus', 'Diplodocus'],
    ['Allosaurus', 'Brontosaurus', 'Iguanodon', 'Parasaurolophus', 'Dilophosaurus', 'Compsognathus/compy', 'Apatosaurus', 'Utahraptor'],
    ['Pachycephalosaurus', 'Carnotaurus', 'Gallimimus', 'Deinonychus', 'Giganotosaurus', 'Baryonyx', 'Archaeopteryx', 'Argentinosaurus', 'Oviraptor', 'Megalosaurus'],
    ['Therizinosaurus', 'Protoceratops', 'Styracosaurus', 'Maiasaura', 'Plateosaurus', 'Coelophysis', 'Ouranosaurus', 'Edmontosaurus', 'Troodon', 'Suchomimus', 'Herrerasaurus', 'Psittacosaurus', 'Microraptor']] },
  { id: 'dances', category: 'Styles of dance', tiers: [
    ['Ballet', 'Hip Hop', 'Salsa', 'Tap'],
    ['Tango', 'Waltz', 'Jazz', 'Breakdancing/breaking/breakdance', 'Ballroom', 'Swing', 'Disco'],
    ['Cha Cha', 'Rumba', 'Flamenco', 'Samba', 'Foxtrot', 'Line Dancing/line dance', 'Square Dancing/square dance', 'Contemporary', 'Polka', 'Belly Dancing/belly dance'],
    ['Merengue', 'Bachata', 'Quickstep', 'Jive', 'Paso Doble', 'Lindy Hop', 'Charleston', 'Bhangra', 'Hula', 'Mambo', 'Jitterbug', 'Krumping/krump'],
    ['Bolero', 'Kathak', 'Bharatanatyam', 'Mazurka', 'Kizomba', 'Capoeira', 'Clogging', 'Gavotte', 'Tarantella', 'Minuet', 'Cumbia', 'Garba', 'Lambada', 'Morris Dancing/morris dance']] },
  { id: 'rivers', category: 'Rivers of the world', tiers: [
    ['Nile', 'Amazon', 'Mississippi'],
    ['Thames', 'Ganges', 'Colorado', 'Danube', 'Yangtze', 'Rio Grande', 'Hudson'],
    ['Seine', 'Rhine', 'Congo', 'Volga', 'Missouri', 'Mekong', 'Euphrates', 'Tigris', 'Ohio', 'Potomac', 'Indus', 'Zambezi'],
    ['Niger', 'Tiber', 'Po', 'Yellow River/huang he/yellow', 'Columbia', 'Yukon', 'Snake', 'Elbe', 'Loire', 'Jordan', 'Orinoco', 'Murray', 'Limpopo', 'Delaware', 'Severn'],
    ['Irrawaddy', 'Brahmaputra', 'Lena', 'Ob', 'Yenisei', 'Amur', 'Dnieper', 'Vistula', 'Oder', 'Ebro', 'Douro', 'Parana', 'Okavango', 'Vltava', 'Salween', 'Mackenzie']] },
  { id: 'cocktails', category: 'Cocktails', tiers: [
    ['Margarita', 'Martini', 'Mojito', 'Pina Colada'],
    ['Cosmopolitan/cosmo', 'Bloody Mary', 'Old Fashioned', 'Daiquiri', 'Long Island Iced Tea/long island', 'Mimosa', 'Moscow Mule'],
    ['Manhattan', 'Negroni', 'Whiskey Sour', 'Mai Tai', 'Gin and Tonic', 'Tequila Sunrise', 'White Russian', 'Espresso Martini', 'Sex on the Beach', 'Aperol Spritz', 'Mint Julep'],
    ['Sidecar', 'Tom Collins', 'Bellini', 'Dark and Stormy', 'Caipirinha', 'Paloma', 'Black Russian', 'Singapore Sling', 'Gimlet', 'Sazerac', 'Screwdriver', 'Hurricane'],
    ['Aviation', 'Boulevardier', 'Last Word', 'Corpse Reviver', 'Vieux Carre', 'Clover Club', 'Penicillin', 'Bramble', 'Ramos Gin Fizz', 'Pisco Sour', 'Paper Plane', 'Zombie', 'Harvey Wallbanger', 'Hanky Panky']] },
  { id: 'bones', category: 'Bones in the human body', tiers: [
    ['Skull/cranium', 'Rib', 'Femur/thigh bone'],
    ['Spine/vertebra/vertebrae', 'Pelvis', 'Collarbone/clavicle', 'Jaw/mandible/jawbone', 'Kneecap/patella', 'Tibia/shin/shinbone'],
    ['Humerus', 'Radius', 'Ulna', 'Fibula', 'Sternum/breastbone', 'Scapula/shoulder blade', 'Tailbone/coccyx', 'Heel bone/calcaneus'],
    ['Sacrum', 'Phalanges/phalanx', 'Metatarsals', 'Metacarpals', 'Stapes/stirrup', 'Hip bone/ilium', 'Anvil/incus', 'Hammer/malleus', 'Cheekbone/zygomatic'],
    ['Hyoid', 'Talus', 'Scaphoid', 'Lunate', 'Hamate', 'Capitate', 'Trapezium', 'Trapezoid', 'Pisiform', 'Cuboid', 'Navicular', 'Vomer', 'Ethmoid', 'Sphenoid', 'Ischium', 'Occipital', 'Parietal']] },
  { id: 'presidents', category: 'US presidents (last name)', tiers: [
    ['Washington/george washington', 'Lincoln/abraham lincoln', 'Obama/barack obama', 'Trump/donald trump', 'Biden/joe biden'],
    ['Kennedy/jfk/john f kennedy', 'Jefferson/thomas jefferson', 'Clinton/bill clinton', 'Bush/george bush', 'Roosevelt/fdr/theodore roosevelt', 'Reagan/ronald reagan', 'Nixon/richard nixon'],
    ['Adams/john adams', 'Carter/jimmy carter', 'Eisenhower', 'Truman', 'Jackson/andrew jackson', 'Grant/ulysses s grant', 'Johnson/lbj', 'Ford/gerald ford', 'Madison/james madison', 'Wilson/woodrow wilson'],
    ['Monroe/james monroe', 'Hoover', 'Coolidge', 'Taft', 'McKinley', 'Garfield', 'Cleveland', 'Harding', 'Hayes'],
    ['Polk', 'Pierce', 'Buchanan', 'Fillmore', 'Tyler', 'Van Buren', 'Arthur', 'Harrison', 'Taylor']] },
]
