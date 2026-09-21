/**
 * More quiz seed tables for the pack family — world knowledge, India, culture,
 * science and fun. Every row is a real fact; the registry chunks these into
 * quick-play packs (see ./registry).
 */

export type FactRow = [string, string, string, string, string]; // [q, answer, w1, w2, w3]

export const WONDERS: FactRow[] = [
  ["The Taj Mahal is in which city?", "Agra", "Delhi", "Jaipur", "Lucknow"],
  ["Petra, the rose-red city, is in…", "Jordan", "Egypt", "Turkey", "Iran"],
  ["Machu Picchu sits in which country?", "Peru", "Mexico", "Chile", "Bolivia"],
  ["The Colosseum is in which city?", "Rome", "Athens", "Naples", "Milan"],
  ["Chichén Itzá is in which country?", "Mexico", "Peru", "Egypt", "Spain"],
  ["The Great Wall is in…", "China", "Japan", "Korea", "Mongolia"],
  ["Christ the Redeemer overlooks which city?", "Rio de Janeiro", "São Paulo", "Lima", "Bogotá"],
  ["Stonehenge is in which country?", "United Kingdom", "Ireland", "France", "Germany"],
  ["The Pyramids of Giza are in…", "Egypt", "Sudan", "Libya", "Iraq"],
  ["Angkor Wat is in which country?", "Cambodia", "Thailand", "Vietnam", "Laos"],
  ["The Statue of Liberty was a gift from…", "France", "Britain", "Spain", "Italy"],
  ["Mount Rushmore carves which figures?", "US presidents", "Greek gods", "Roman emperors", "Indian leaders"],
];

export const INDIA_GK: FactRow[] = [
  ["Capital of Rajasthan?", "Jaipur", "Udaipur", "Jodhpur", "Kota"],
  ["Capital of Karnataka?", "Bengaluru", "Mysuru", "Mangaluru", "Hubballi"],
  ["Capital of Tamil Nadu?", "Chennai", "Coimbatore", "Madurai", "Salem"],
  ["Capital of West Bengal?", "Kolkata", "Siliguri", "Howrah", "Durgapur"],
  ["Capital of Maharashtra?", "Mumbai", "Pune", "Nagpur", "Nashik"],
  ["Which state is called God's Own Country?", "Kerala", "Goa", "Sikkim", "Assam"],
  ["Which city is the IT hub called Silicon Valley of India?", "Bengaluru", "Hyderabad", "Pune", "Chennai"],
  ["The Konark Sun Temple is in…", "Odisha", "Bengal", "Bihar", "Assam"],
  ["The Golden Temple is in…", "Amritsar", "Ludhiana", "Chandigarh", "Jalandhar"],
  ["Which state has the longest coastline?", "Gujarat", "Tamil Nadu", "Kerala", "Maharashtra"],
  ["The Sundarbans are famous for…", "Royal Bengal tigers", "Lions", "Elephants", "Rhinos"],
  ["Cherrapunji is famous for…", "Heavy rainfall", "Snow", "Deserts", "Volcanoes"],
];

export const SCIENCE_GK: FactRow[] = [
  ["Chemical symbol for gold?", "Au", "Ag", "Go", "Gd"],
  ["Speed of light is about…", "300,000 km/s", "150,000 km/s", "1,080 km/h", "30,000 km/s"],
  ["What is H2O?", "Water", "Salt", "Oxygen", "Hydrogen peroxide"],
  ["Which planet has the most moons?", "Saturn", "Jupiter", "Uranus", "Neptune"],
  ["DNA carries…", "Genetic information", "Oxygen", "Electric charge", "Sound"],
  ["Force that pulls objects to Earth?", "Gravity", "Magnetism", "Friction", "Tension"],
  ["Which gas makes up most of Earth's air?", "Nitrogen", "Oxygen", "Carbon dioxide", "Argon"],
  ["Unit of electric current?", "Ampere", "Volt", "Watt", "Ohm"],
  ["What does a prism do to white light?", "Splits it into colours", "Absorbs it", "Speeds it up", "Bends it black"],
  ["Which metal is liquid at room temperature?", "Mercury", "Iron", "Lead", "Zinc"],
  ["Photosynthesis happens in which organelle?", "Chloroplast", "Nucleus", "Mitochondria", "Ribosome"],
  ["What did Newton formulate?", "Laws of motion", "Periodic table", "Theory of relativity", "DNA structure"],
];

export const CULTURE_GK: FactRow[] = [
  ["Yoga originated in…", "India", "China", "Japan", "Thailand"],
  ["Karate comes from…", "Japan (Okinawa)", "China", "Korea", "Thailand"],
  ["Taekwondo is the national sport of…", "South Korea", "Japan", "China", "Mongolia"],
  ["The Mona Lisa hangs in…", "The Louvre, Paris", "The Met, New York", "The Prado, Madrid", "The Uffizi, Florence"],
  ["Flamenco dance comes from…", "Spain", "Portugal", "Italy", "Argentina"],
  ["Ballet began in which country?", "Italy (popularised in France)", "Russia", "France", "England"],
  ["The Sistine Chapel is in…", "Vatican City", "Rome's town hall", "Florence", "Milan"],
  ["Origami is the art of…", "Paper folding", "Flower arranging", "Tea ceremony", "Calligraphy"],
  ["The Olympic torch is lit in…", "Olympia, Greece", "Paris", "Lausanne", "Athens city centre"],
  ["Bhangra is a folk dance from…", "Punjab", "Gujarat", "Rajasthan", "Haryana"],
  ["Kathakali is a dance form from…", "Kerala", "Tamil Nadu", "Karnataka", "Andhra"],
  ["Sushi etiquette: sushi is traditionally eaten…", "With fingers or chopsticks", "Only with a fork", "Frozen", "With ketchup"],
];

export const SPORTS_GK: FactRow[] = [
  ["How many players on a cricket team?", "11", "10", "12", "9"],
  ["The Ashes is contested between…", "England and Australia", "India and Pakistan", "Australia and NZ", "England and India"],
  ["FIFA World Cup happens every…", "4 years", "2 years", "3 years", "5 years"],
  ["Which country has won the most FIFA World Cups?", "Brazil", "Germany", "Italy", "Argentina"],
  ["Grand Slam tennis has how many majors a year?", "4", "3", "5", "2"],
  ["Wimbledon is played on…", "Grass", "Clay", "Hard court", "Carpet"],
  ["In basketball, a free throw is worth…", "1 point", "2 points", "3 points", "0 points"],
  ["The NFL Super Bowl is…", "American football", "Rugby", "Soccer", "Cricket"],
  ["Viswanathan Anand is a legend of…", "Chess", "Snooker", "Bridge", "Go"],
  ["Major Dhyan Chand is associated with…", "Hockey", "Cricket", "Football", "Athletics"],
  ["A marathon is…", "42.195 km", "21.0975 km", "50 km", "30 km"],
  ["PV Sindhu plays…", "Badminton", "Tennis", "Squash", "Table tennis"],
];

export const MOVIES_GK: FactRow[] = [
  ["First Indian film to win an Oscar (Music)?", "Slumdog Millionaire", "Lagaan", "Mother India", "RRR (song, later)"],
  ["'Sholay' starred…", "Dharmendra and Amitabh", "Raj Kapoor", "Shah Rukh Khan", "Salman Khan"],
  ["Studio behind Frozen?", "Disney", "Pixar", "DreamWorks", "Ghibli"],
  ["Studio behind Toy Story?", "Pixar", "Disney Animation", "Illumination", "Laika"],
  ["Baahubali was directed by…", "S.S. Rajamouli", "Shankar", "Mani Ratnam", "Sanjay Leela Bhansali"],
  ["'Dilwale Dulhania Le Jayenge' released in…", "1995", "1990", "2000", "1998"],
  ["Ghibli's 'Spirited Away' is from…", "Japan", "Korea", "China", "France"],
  ["Marvel's first film (MCU) was…", "Iron Man", "Captain America", "Thor", "Hulk"],
  ["'Nayakan' starred…", "Kamal Haasan", "Rajinikanth", "Mammootty", "Chiranjeevi"],
  ["Satyajit Ray's famous trilogy begins with…", "Pather Panchali", "Aparajito", "The World of Apu", "Devi"],
  ["The highest-grossing Indian film worldwide (2023) was…", "Jawan", "Pathaan", "Gadar 2", "Leo"],
  ["Oscar-winning song 'Naatu Naatu' is from…", "RRR", "KGF 2", "Pushpa", "Vikram"],
];

export const MUSIC_GK: FactRow[] = [
  ["How many strings does a violin have?", "4", "5", "6", "3"],
  ["The sitar has how many main playing strings?", "7 (varies by style)", "4", "12", "6"],
  ["Beethoven wrote how many symphonies?", "9", "7", "11", "5"],
  ["The Beatles were from…", "Liverpool", "London", "Manchester", "Dublin"],
  ["Ravi Shankar mastered the…", "Sitar", "Tabla", "Sarod", "Flute"],
  ["A group of four musicians is a…", "Quartet", "Trio", "Quintet", "Duet"],
  ["Classical Indian 'raga' means…", "A melodic framework", "A drum beat", "A dance step", "A costume"],
  ["AR Rahman won Oscars for…", "Slumdog Millionaire", "Lagaan", "Roja", "Rockstar"],
  ["Guitar frets are…", "Metal strips on the neck", "Strings", "Pickups", "Tuning pegs"],
  ["'Carnatic' music is from…", "South India", "North India", "Pakistan", "Bangladesh"],
  ["Octave means…", "8 notes apart", "4 beats", "A drum solo", "Twice as loud"],
  ["Mozart's first opera premiered at age…", "12", "18", "25", "30"],
];

export const GAMES_GK: FactRow[] = [
  ["Mario first appeared in…", "Donkey Kong (1981)", "Super Mario Bros.", "Mario Kart", "Galaxy"],
  ["Tetris was created in…", "The Soviet Union", "Japan", "USA", "Germany"],
  ["Minecraft was made by…", "Markus 'Notch' Persson", "Shigeru Miyamoto", "Gabe Newell", "Sid Meier"],
  ["Pokémon launched in which year?", "1996", "1990", "2001", "1989"],
  ["Ludo comes from the ancient game…", "Pachisi", "Chess", "Go", "Mancala"],
  ["Chess originated in…", "India (as Chaturanga)", "China", "Persia", "Russia"],
  ["Snakes and Ladders began as…", "Moksha Patam (moral lessons)", "A Roman dice game", "A Victorian parlor game", "A navy training tool"],
  ["Pac-Man was made by…", "Namco", "Nintendo", "Sega", "Atari"],
  ["The Elder Scrolls V is subtitled…", "Skyrim", "Oblivion", "Morrowind", "Arena"],
  ["Free Fire is a…", "Battle royale", "Racing game", "Puzzle game", "Farming sim"],
  ["Esports title 'Dota 2' stands for…", "Defense of the Ancients 2", "Duel of the Arena 2", "Dawn of the Alliance 2", "Duty of the Army 2"],
  ["Carrom uses…", "A striker and coins", "Dice", "Cards", "Tiles"],
];

export const RIDDLE_PACK: FactRow[] = [
  ["What has a face and two hands but no arms?", "A clock", "A doll", "A mirror", "A coin"],
  ["What has teeth but cannot bite?", "A comb", "A saw only", "A zipper only", "A garlic"],
  ["What can you catch but not throw?", "A cold", "A ball", "A fish", "A star"],
  ["What has words but never speaks?", "A book", "A phone", "A parrot", "A radio"],
  ["What gets bigger the more you take away?", "A hole", "A balloon", "A cake", "A shadow"],
  ["What has a thumb and four fingers but is not alive?", "A glove", "A statue", "A robot", "A tree"],
  ["I'm tall when young and short when old. What am I?", "A candle", "A person", "A tree", "A pencil"],
  ["What runs but never walks?", "A river", "A horse", "A clock only", "An engine"],
  ["What has many keys but can't open a single lock?", "A piano", "A keyboard", "A janitor", "A map"],
  ["What can travel around the world staying in a corner?", "A stamp", "A coin", "A passport", "A compass"],
  ["What invention lets you look right through walls?", "A window", "A telescope", "X-ray", "A mirror"],
  ["What's black when clean and white when dirty?", "A chalkboard", "Paper", "A shirt", "Coal"],
];

export const FLAGS_GK: FactRow[] = [
  ["Which country's flag is a red circle on white?", "Japan", "Bangladesh", "Korea", "China"],
  ["Whose flag has a maple leaf?", "Canada", "Lebanon", "Norway", "Switzerland"],
  ["Which flag is entirely green with a white crescent and star?", "Pakistan", "Turkey", "Algeria", "Maldives"],
  ["The tricolour with a chakra belongs to…", "India", "Niger", "Ireland", "Ivory Coast"],
  ["Whose flag is a plain red circle on a green field?", "Bangladesh", "Japan", "Morocco", "Maldives"],
  ["The Union Jack belongs to…", "The United Kingdom", "The USA", "Australia", "New Zealand"],
  ["Whose flag features a cedar tree?", "Lebanon", "Canada", "Cyprus", "Fiji"],
  ["The 'Stars and Stripes' is…", "The USA", "Liberia", "Malaysia", "China"],
  ["Which country's flag is the only non-quadrilateral national flag?", "Nepal", "Switzerland", "Vatican City", "Qatar"],
  ["South Africa's flag has how many colours?", "6", "3", "4", "5"],
  ["Whose flag shows a dragon?", "Bhutan", "China", "Wales", "Sri Lanka"],
  ["Brazil's flag motto is…", "Ordem e Progresso", "E Pluribus Unum", "Liberté", "Viva Brasil"],
];

export const MYTHOLOGY_GK: FactRow[] = [
  ["Rama's loyal devotee and monkey god?", "Hanuman", "Ganesha", "Sugriva", "Vali"],
  ["Who wrote the Mahabharata?", "Vyasa", "Valmiki", "Tulsidas", "Ved Vyas's son Shuka"],
  ["Ganesha's vehicle is a…", "Mouse", "Peacock", "Eagle", "Lion"],
  ["Zeus is the Greek god of…", "Thunder", "Sea", "War", "Sun"],
  ["Thor wields a…", "Hammer", "Spear", "Sword", "Bow"],
  ["The Ramayana was composed by…", "Valmiki", "Vyasa", "Kalidasa", "Bana"],
  ["Krishna counsels Arjuna in the…", "Bhagavad Gita", "Vedas", "Upanishads", "Puranas"],
  ["Ra is the Egyptian god of…", "The Sun", "The Nile", "Death", "Wisdom"],
  ["Hermes is the messenger of…", "The Greek gods", "Rome", "Egypt", "Troy"],
  ["Saraswati is the goddess of…", "Knowledge and arts", "Wealth", "War", "Harvest"],
  ["Anansi, the trickster spider, comes from…", "West African folklore", "Norse tales", "Japanese myth", "Celtic lore"],
  ["The Norse tree of life is called…", "Yggdrasil", "Asgard", "Bifrost", "Valhalla"],
];

export const SPACE_GK: FactRow[] = [
  ["Which planet spins on its side?", "Uranus", "Venus", "Neptune", "Mars"],
  ["A light-year measures…", "Distance", "Time", "Brightness", "Speed"],
  ["The Sun is a…", "Star", "Planet", "Comet", "Moon"],
  ["What keeps planets in orbit?", "Gravity", "Magnetism", "Solar wind", "Friction"],
  ["A shooting star is actually a…", "Meteor", "Comet", "Satellite", "Distant plane"],
  ["Comets are made mostly of…", "Ice and dust", "Rock only", "Iron", "Gas only"],
  ["Which spacecraft left the solar system?", "Voyager 1", "Apollo 11", "Cassini", "Hubble"],
  ["The Milky Way is a…", "Galaxy", "Nebula", "Constellation", "Comet"],
  ["Black holes have gravity so strong that…", "Not even light escapes", "Time speeds up", "Planets glow", "Stars freeze"],
  ["Aditya-L1 studies…", "The Sun", "Mars", "The Moon", "Jupiter"],
  ["A nebula is where…", "Stars are born", "Planets die", "Comets rest", "Galaxies end"],
  ["Earth's only natural satellite is…", "The Moon", "Titan", "Europa", "Phobos"],
];

export const TECH_GK: FactRow[] = [
  ["What does 'Wi-Fi' NOT officially stand for?", "Wireless Fidelity", "It's a brand name, not an acronym", "Wide Fidelity", "Wired Fiber"],
  ["Who is called the father of computers?", "Charles Babbage", "Alan Turing", "Bill Gates", "John von Neumann"],
  ["The first computer bug was literally a…", "Moth", "Fly", "Cockroach", "Spider"],
  ["Google started as a research project at…", "Stanford", "MIT", "Harvard", "Oxford"],
  ["Open-source software means you can…", "View and modify its code", "Use it only once", "Only read about it", "Never share it"],
  ["What does CPU stand for?", "Central Processing Unit", "Computer Power Unit", "Core Program Utility", "Central PC Unit"],
  ["Python is a…", "Programming language", "Search engine", "Chip brand", "Browser"],
  ["Which company makes the Switch console?", "Nintendo", "Sony", "Microsoft", "Sega"],
  ["Encryption protects data by…", "Scrambling it with keys", "Deleting it", "Hiding the screen", "Printing it"],
  ["The '@' in email separates…", "User and domain", "Subject and body", "To and Cc", "Day and time"],
  ["QR codes were invented in…", "Japan", "USA", "China", "Korea"],
  ["1 GB equals roughly…", "1,000 MB", "100 MB", "10 MB", "10,000 MB"],
];

export const FOOD_GK: FactRow[] = [
  ["Biryani likely originated from…", "Persian pilaf traditions", "Italian risotto", "Chinese rice bowls", "Spanish paella"],
  ["Butter chicken was invented in…", "Delhi", "Lucknow", "Hyderabad", "Amritsar"],
  ["Which cheese is traditionally on pizza Margherita?", "Mozzarella", "Cheddar", "Feta", "Parmesan only"],
  ["Wasabi is usually served with…", "Sushi", "Pasta", "Tacos", "Curry"],
  ["Chocolate is made from…", "Cacao beans", "Vanilla pods", "Coffee beans", "Almonds"],
  ["Honey never…", "Spoils", "Crystallises", "Tastes sweet", "Melts"],
  ["Idli is steamed from…", "Fermented rice-lentil batter", "Wheat dough", "Corn meal", "Gram flour only"],
  ["The spiciest part of a chilli is…", "The placenta (inner membrane)", "The skin", "The seeds only", "The stem"],
  ["Paneer is…", "Fresh Indian cheese", "A lentil", "Yogurt", "Ghee"],
  ["Guacamole's main ingredient?", "Avocado", "Peas", "Kiwi", "Cucumber"],
  ["Croissants get flaky layers from…", "Butter folded in dough", "Sugar", "Yeast only", "Egg wash"],
  ["Masala chai's core spices often include…", "Cardamom and ginger", "Cinnamon only", "Cloves only", "Saffron only"],
];

export const GEO_GK: FactRow[] = [
  ["Largest country by area?", "Russia", "Canada", "China", "USA"],
  ["Most populous country (2025)?", "India", "China", "USA", "Indonesia"],
  ["Which desert covers much of North Africa?", "Sahara", "Gobi", "Kalahari", "Thar"],
  ["The Amazon rainforest is mostly in…", "Brazil", "Peru", "Colombia", "Venezuela"],
  ["Which two continents does Russia span?", "Europe and Asia", "Asia and Africa", "Europe and Africa", "Asia and Oceania"],
  ["The Nile flows into the…", "Mediterranean Sea", "Red Sea", "Atlantic", "Indian Ocean"],
  ["Which of these is entirely a city-state?", "Singapore", "Fiji", "Malta", "Bahrain"],
  ["Mount Kilimanjaro is in…", "Tanzania", "Kenya", "Uganda", "Ethiopia"],
  ["Which sea is the saltiest (famous for floating)?", "Dead Sea", "Red Sea", "Baltic", "Black Sea"],
  ["The Andes run along which coast?", "South America's west", "Africa's east", "Asia's south", "North America's east"],
  ["Which country has the most time zones?", "France (with territories)", "Russia", "USA", "China"],
  ["Which strait separates Asia and North America?", "Bering Strait", "Gibraltar", "Malacca", "Hormuz"],
];

export const HISTORY_GK: FactRow[] = [
  ["India became independent in…", "1947", "1950", "1945", "1962"],
  ["The Constitution of India came into force…", "26 January 1950", "15 August 1947", "2 October 1950", "26 November 1949"],
  ["The Great Pyramid was built around…", "2560 BC", "1200 BC", "500 AD", "1000 BC"],
  ["The Renaissance began in…", "Italy", "France", "England", "Greece"],
  ["Who was the first President of India?", "Dr. Rajendra Prasad", "Nehru", "Radhakrishnan", "Kalam"],
  ["The Berlin Wall fell in…", "1989", "1979", "1991", "1985"],
  ["Jallianwala Bagh massacre happened in…", "1919", "1857", "1930", "1942"],
  ["Who led the Dandi March?", "Mahatma Gandhi", "Nehru", "Bhagat Singh", "Tilak"],
  ["The Titanic sank in…", "1912", "1905", "1920", "1898"],
  ["D-Day landings took place in…", "1944", "1941", "1939", "1945"],
  ["Ashoka belonged to which dynasty?", "Maurya", "Gupta", "Chola", "Mughal"],
  ["The first Olympics of the modern era were held in…", "1896, Athens", "1900, Paris", "1892, Rome", "1904, St. Louis"],
];

export const CRICKET_GK: FactRow[] = [
  ["How many balls in a standard over?", "6", "4", "5", "8"],
  ["What is a 'duck'?", "Score of zero", "A catch", "A wide ball", "A six"],
  ["Sachin's international centuries?", "100", "99", "101", "51"],
  ["Who has the most international wickets?", "Muttiah Muralitharan", "Shane Warne", "James Anderson", "Anil Kumble"],
  ["The IPL began in…", "2008", "2005", "2010", "2003"],
  ["What does LBW stand for?", "Leg Before Wicket", "Left Bat Wide", "Long Bounce Wicket", "Leg By Wicket"],
  ["How long is a cricket pitch (between creases)?", "22 yards", "20 yards", "24 yards", "25 yards"],
  ["Who captained India to the 2011 World Cup?", "MS Dhoni", "Sourav Ganguly", "Rahul Dravid", "Virat Kohli"],
  ["A 'maiden over' concedes…", "No runs", "One run", "Only boundaries", "Only wides"],
  ["Kapil Dev lifted the World Cup in…", "1983", "1987", "1975", "1996"],
  ["What is a T10 league match length?", "10 overs per side", "20 overs", "5 overs", "15 overs"],
  ["Duckworth-Lewis is used for…", "Rain-affected targets", "Umpire reviews", "Toss decisions", "Player rankings"],
];

export const BRANDS_GK: FactRow[] = [
  ["Nike's slogan?", "Just Do It", "Impossible is Nothing", "Believe", "Play Fair"],
  ["The Apple logo shows…", "An apple with a bite", "A cherry", "A pear", "Grapes"],
  ["Which brand's tagline is 'Finger Lickin' Good'?", "KFC", "McDonald's", "Dominos", "Burger King"],
  ["Cadbury is a brand of…", "Chocolate", "Chips", "Biscuits only", "Juice"],
  ["Amul's mascot is the…", "Butter Girl", "Tiger", "Milkman", "Cowboy"],
  ["Zomato and Swiggy are…", "Food delivery apps", "Taxi apps", "Bank apps", "Game studios"],
  ["Tata's car brand for EVs includes…", "Nexon EV", "Model 3", "Leaf", "Kona"],
  ["Which company makes Maggi?", "Nestlé", "ITC", "HUL", "Britannia"],
  ["Adidas was founded in…", "Germany", "USA", "UK", "Italy"],
  ["The 'swoosh' belongs to…", "Nike", "Puma", "Reebok", "Fila"],
  ["Airtel is an Indian…", "Telecom operator", "Bank", "Airline", "Carmaker"],
  ["Boeing and Airbus make…", "Aeroplanes", "Trains", "Ships", "Cars"],
];
