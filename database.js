/**
 * This script creates our database.
 *
 * @author Marshall Mattingly
 */
var nosql = require('nosql').load(__dirname+'/database.nosql');

/** TODO: My thoughts on data structure, will make graph.

Basic breakdown:

CHAPTER 1 (wide-reaching, such as religion, immigration, etc)
    STORY 1 (specific story relating to the chapter, i.e. population through time, etc)
        SECTION 1 (i.e. part of the narrative, related to a year)
        ...
        SECTION N
    ...
    STORY N
CHAPTER N

{
    'chapters': [   // array for all the chapters in the atlas
        {
            'slug': 'slug',     // slug for the URL
            'name': 'name',     // full name of the chapter
            'blurb': 'blurb',   // short blurb to put on the front-page or elsewhere
            'img': 'name'       // name of an image to use (if we want to implement)
            'stories': [        // array for all of the stories that make up this chapter
                {
                    'slug': 'slug',     // slug for the URL (if not defined, this is the index)
                    'name': 'name',     // full name of the story (if not defined, this is the index)
                    'map': {            // info for the ArcGIS map
                        'url': 'url'
                    },
                    'type': 'type',     // type of the story (text or map)
                    'title': 'title',   // title on popup when user clicks
                    'text': 'text',     // text on popup when user clicks, 
                    'citations': [      // array of all citations used in the narrative
                        'citation',     // text for the citation
                        ...
                    ],
                    'bibliography': [   // array of all bibliography elements in the narrative
                        'bibliography', // text for the bibliography element
                        ...
                    ],
                    'sections': [       // array for all the narrative sections
                        {
                            'start_year': 'int',    // starting year for scrolling
                            'end_year': 'int,       // ending year for scrolling  
                            'title': 'title',       // title for this section
                            'content': 'content'    // actual content for this section (paragraphs)
                        }
                        ...
                    ]
                }
            ]
        }
        ...
    ]
}

We can pull the scrollbar information directly from the map to generate it on-the-fly. Then, when someone
ticks to a new year, we'll go through the sections and look for which section it belongs to, scrolling
automatically to it (if needed) and updating the map. I'm using a start/end system for the sections so
sections that cover a wide range (i.e. 1920 - 1950, the WWI/II years) can be on the same narrative, while
still allowing the user to go through the years. If title is blank, we wouldn't push one, creating seemless
content.

*/

// Chapter 1 with just text
var chapter1 = {
    'slug': 'making-of-the-state',
    'name': 'Making of the State',
    'blurb': 'Most of what would become the Dakota Territory was originally purchased in 1803 from the French. Although the Louisiana Purchase opened up the west for Americans much of the northern areas of the purchase were left untouched for nearly a half a century. The land that would become North Dakota were left to fur traders and native tribes but the soon to be North Dakota would experience massive changes in a short period of time and propel itself on the course to statehood. There were two major factors that launched North Dakota on the track to statehood, the milling industry in Minneapolis and the construction of the Northern Pacific railroad through the state.',
    'stories': [{
        'type': 'text',
        'citations': [
            'Robinson, Elwyn B. History of North Dakota, (Fargo: North Dakota Institute for Regional Studies, 1995), 134',
            'Robinson, Elwyn B. History of North Dakota, 135',
            'Robinson, Elwyn B. History of North Dakota, 136',
            'Wemett, W.M. The Story of the Flickertail State, (Valley City; W. M. Wemett, 1923), 238',
            'Wemett, W.M. The Story of the Flickertail State, 234',
            'Robinson, Elwyn B. History of North Dakota, 137',
            'Robinson, Elwyn B. History of North Dakota, 138',
            'Robinson, Elwyn B. History of North Dakota, 149',
            'Robinson, Elwyn B. History of North Dakota, 145',
            'Tweton, Jerome D. Jelliff, Theodore. North Dakota: The Heritage of a People, (Fargo: North Dakota Institute for Regional Studies, 1976), 107',
            'Robinson, Elwyn B. History of North Dakota, 199',
            'Tweton, Jerome D. Jelliff, Theodore. North Dakota: The Heritage of a People, 106',
            'Tweton, Jerome D. Jelliff, Theodore. North Dakota: The Heritage of a People, 107',
            'Tweton, Jerome D. Jelliff, Theodore. North Dakota: The Heritage of a People, 109',
            'Tweton, Jerome D. Jelliff, Theodore. North Dakota: The Heritage of a People, 110',
            'Tweton, Jerome D. Jelliff, Theodore. North Dakota: The Heritage of a People, 109',
            'US. Department of Commerce. Census of Population and Housing 1890. Washington Printing Office. https://www.census.gov/prod/www/decennial.html (accessed Dec 1, 2014).'
        ],
        'bibliography': [
            'US. Department of Commerce. Statistical Abstract of the United States. Washington Printing Office, 1870.',
            'US. Department of Commerce. Statistical Abstract of the United States. Washington Printing Office, 1880.',
            'US. Department of Commerce. Statistical Abstract of the United States. Washington Printing Office, 1890.',
            'US. Department of Commerce. Census of Population and Housing 1870. Washington Printing Office. https://www.census.gov/prod/www/decennial.html (accessed Dec 1, 2014).',
            'US. Department of Commerce. Census of Population and Housing 1880. Washington Printing Office. https://www.census.gov/prod/www/decennial.html (accessed Dec 1, 2014).',
            'US. Department of Commerce. Census of Population and Housing 1890. Washington Printing Office. https://www.census.gov/prod/www/decennial.html (accessed Dec 1, 2014).',
            'Robinson, Elwyn B. History of North Dakota, (Fargo: North Dakota Institute for Regional Studies, 1995)',
            'Tweton, Jerome D. Jelliff, Theodore. North Dakota: The Heritage of a People, (Fargo: North Dakota Institute for Regional Studies, 1976)',
            'Wemett, W.M. The Story of the Flickertail State, (Valley City; W. M. Wemett, 1923)'
        ],
        'sections': [{
            'content': 'Most of what would become the Dakota Territory was originally purchased in 1803 from the French. Although the Louisiana Purchase opened up the west for Americans much of the northern areas of the purchase were left untouched for nearly a half a century. The land that would become North Dakota were left to fur traders and native tribes but the soon to be North Dakota would experience massive changes in a short period of time and propel itself on the course to statehood. There were two major factors that launched North Dakota on the track to statehood, the milling industry in Minneapolis and the construction of the Northern Pacific railroad through the state.'
        },
        {
            'content': ' By 1870 Minneapolis had become the biggest milling city in the United States. Using new technology the millers had found a way to create a better product. Producing spring wheat flour the bran (which was very brittle) breaks into small pieces and become very hard to sift out of the product.{{cite:1}} This made spring wheat flour less desirable then the easier to sift winter wheat, therefore making it less profitable. The millers from Minneapolis discovered a way to eliminate the bran issue by importing specialized porcelain rollers instead of milling stones that crushed wheat in a more controlled uniform fashion.{{cite:2}} This way the wheat could be crushed without completely shattering the bran.'
        },
        {
            'content': ' Armed with this new technology and the power produced by St. Anthony\'s Falls Minneapolis expanded exponentially. Mills were being built even though a large majority of wheat in Minnesota and Wisconsin (mostly winter wheat) was already promised to other milling hubs such as Chicago and Milwaukee.{{cite:3}} Mills at times were forced to shut down due to lack of wheat. This problem needed to be addressed and the millers turned to the Dakota Territory.'
        },
        {
            'content': ' The Dakota Territory was very isolated from the rest of the US for most of the 1800s. It wasn\'t until 1870 that the first tracks of the Northern Pacific Railroad were laid down in the state. The Northern Pacific was designed to connect the Twin Cities with the rich wheat lands of the Dakotas, as well as to the Pacific Ocean at Seattle.{{cite:4}} When the project was commissioned the company received a vast land grant to finance the creation of the tracks. 40 miles of land was awarded on either side of the proposed tracks, a total area that equates to 1.5X the size of North Dakota itself.{{cite:5}} Stock holders had the option to exchange stock holdings for land that was equal to the land of the stock.'
        },
        {
            'content': 'Many holders decided to act on this option and acquired huge tracts of land that became known as Bonanza Farms. These farms took up tens of thousands of square acres and employed large work crews to handle such large tracts of land. Theses farms flourished during the 1870s and became increasingly profitable. The large amounts of wheat produced were sent down to Minneapolis which increased their growth. This symbiotic relationship fueled the state until the Bonanza farms were seen to be too powerful and were broken up by proprietors before the turn of the century.{{cite:6}}'
        },
        {
            'content': ' Accompanying the large farms many homesteaders laid claim to the land. A man could pay the Federal Government $14 and receive 160 acres which he was legally bound to live on and improve for 5 years. At the end of his time on the land he could choose to leave or pay $40 to fully assume the title.{{cite:7}} Although many pioneers began their lives on the prairie in this way many more simply bought land from the rail road. It was more expensive to homestead in this manor, with prices averaging 4.94 per acre east of the Missouri River and 3.18 west of it, it did give the farmer easy access to the Minneapolis market.{{cite:8}} The Railroad would also bring settlers out and establish colonies along their tracks to create towns. By settling 50 to 100 families in the same area towns would form almost immediately giving the railroads permanent stops as they traveled along the tracks.{{cite:9}}'
        },
        {
            'content': 'The population in the territory boomed surging from just a few thousand to over half a million by the 1890 census, with about two thirds of its population living in the southern half of the territory.{{cite:10}} The push for statehood was truly kicked off by the Yankton group in the 1870s. A group of Republicans working out of the territorial capital (Yankton, South Dakota) wished to throw off the heavily government controlled territorial system where many of the leaders were appointed by the President instead of being elected.{{cite:11}} The group was dealt a devastating blow in 1883 when then Governor of the Territory Nehemiah Ordway moved the territorial capital from Yankton to the less populated Bismarck.{{cite:12}} This shift in power put the state in the pocket of the railroad and other out of state political groups. Yankton may have been dealt a blow but now the state wanted freedom.'
        },
        {
            'content': 'The Dakota Territory would soon get their wish. In 1889 Congress voted on the Omnibus Bill, which set into motion for the creation of Washington, Montana, and both the Dakotas. This came as a shock to most of the Dakotans who had wanted to come into the Union as one single state. Yet through this set back the soon to be State of North Dakota elected its first 75 delegates lay down the frame work of the state. The summer of 1889 these delegates met in Bismarck to accomplish their task. Only 9 of these men were over the age of 50 and 29 of them were farmers, the most prevalent occupation.{{cite:13}} This uniquely North Dakotan mix of men represented the youthful agriculturally centered economy of the state.'
        },
        {
            'content': 'The State Constitution was drafted by a Harvard Law Professor although many changes were made to ensure the protection of the state. The Constitution when finally finished was six times the length of the United States Constitution.{{cite:14}} It called for a Senate of 30-50 men and a House of 60-140 men. The delegates also put in laws to hold its Government in check such as anti-log rolling measures, which consider buying votes with promises of returned votes or goods to be considered a bribe. If caught a delegate would be thrown out the legislative system and possibly tried in court.{{cite:15}} Another unique characteristic of the new government was the splitting power of many government positions, such as Attorney General, Secretary of State, Auditor, Superintendent of the school system, as well as many other positions.{{cite:16}} This was hoped to quell collusion in office and keep the legislature honest and true. The final act of legislation that was unique to North Dakota was the banning of liquor; North Dakota is one of the only states to not only be dry before national prohibition but also started out that way.'
        },
        {
            'content': 'Starting from the vast expanse of land, barely inhabited the vast plains had been transformed in just under 30 years. The introduction of the Northern Pacific Railroad made farming in this isolated area attainable and the need for wheat in the Minneapolis gave people a market to sell their goods. The expansion had been abrupt and swift, taking the state like a wild fire. Before the tracks had been laid North Dakota had a total population of just over 2000 official residence, by the time of the first state census the population was counted at 190,983.{{cite:17}} North Dakota had done it. The future beckoned to the State and as the end of the century drew near the citizens turned to the horizons knowing that this new land was theirs.'
        }]
    }]
};

// Chapter 2 with a basic map
var chapter2 = {
    'slug': 'the-depression',
    'name': 'The Depression',
    'blurb': 'The war was now over. Celebrations occurred across the nation as troops poured back into the country. The 1920s were poised to be a decade of elegance and abundance. North Dakota also rejoiced as their boys came home. Farmers were ready to continue to feed the world and enjoy the high demands that were expected of them but it was not to be so. The end of the World War One marked a sharp downturn for the state. While the rest of the country enjoyed parties and luxuries courtesy of easy to obtain credit North Dakotans were already in a deep recession, only to be dragged down even further when the stock market finally crashed. This Depression lasting more than 20 years nearly ruined the state.',
    'stories': [{
        'map': 'http://undgeography.und.edu/geographyund/rest/services/ND125/WebMapND125/MapServer',
        'type': 'map',
        'title': 'Population for ${YEAR}',
        'text': 'Test text, please ignore',
        'sections': [{
            'start_year': '1920',
            'end_year': '1920',
            'title': '1920',
            'content': 'The war was now over. Celebrations occurred across the nation as troops poured back into the country. The 1920s were poised to be a decade of elegance and abundance. North Dakota also rejoiced as their boys came home. Farmers were ready to continue to feed the world and enjoy the high demands that were expected of them but it was not to be so. The end of the World War One marked a sharp downturn for the state. While the rest of the country enjoyed parties and luxuries courtesy of easy to obtain credit North Dakotans were already in a deep recession, only to be dragged down even further when the stock market finally crashed. This Depression lasting more than 20 years nearly ruined the state.'
        },
        {
            'start_year': '1921',
            'end_year': '1921',
            'title': '1921',
            'content': 'When Europe produced an abundance of grain the year following the end of the war and other countries continue to export wheat to remaining European buyers, farmers came face to face with an abundance of wheat in a highly competitive market.{{cite:1}} When the price controls were removed the flooded market crashed. Prices went from an average of $2.35 a bushel in 1919 down to $1.01 in 1921. Unfortunately, in that perfect storm the North Dakotans couldn\'t just cut their losses and run. Everything they owned, as a result of the rapid expansion, was tied to the banks. The very land and way of life that these immigrants had traveled to attain was now hanging by a thread. All the state could do was try to break even by continuing to produce larger and larger amounts of wheat.'
        },
        {
            'start_year': '1922',
            'end_year': '1922',
            'title': '1922',
            'content': 'To cash in on high wheat prices during the war years many farmers cultivate as much land as possible. As a result demand for acreage coupled with wartime inflation temporarily pushed land prices higher. In 1910 a farmer could purchase land for $26 per acre. By 1920 that price had risen to $35 and that was for land that was left over: an increase of about $160 by today\'s standards.{{cite:2}} Without proper understanding of basic sustainable agricultural methods or second thoughts to the fertility of the soil, cost of seed or cost of increased labor, farmers bought up huge tracts of land for inflated prices. Easily obtained credit fueled the new investments. After all, it was national policy to put more acres under the plow.'
        },
        {
            'start_year': '1923',
            'end_year': '1923',
            'title': '1923',
            'content': 'Many farmers "preferred to keep their original purchase encumbered in order to have money to buy additional lands."{{cite:3}} Many of these loans were taken out with interest rates in excess of 8%. By 1916 the region\'s interest rates on short term loans (loans due back in 3 to 12 months) were the highest in the nation at 10.75%.{{cite:4}} With this kind of debt load any misfortune in this house of cards could cause collapse: drought, flood, hail, locust, price drop or even a family illness. The Federal Farm Loan Act of 1916 capped interest rates at 6% but by the time it was enacted most of the damage was already done.{{cite:5}}'
        },
        {
            'start_year': '1924',
            'end_year': '1924',
            'title': '1924',
            'content': 'Accompanying the increase in loans to buy up more land was an increase in homestead farm mortgages and an increase in non-owner tenants. In 1910 half of the farms in North Dakota were mortgaged by their owners. By 1920 that rate had swollen to 71%.{{cite:6}} The mortgage debt in North Dakota more than doubled during the period of 1910-1919 in sync with national efforts to ramp up wartime production. Starting at $48,000,000 the debt ballooned to $108,000,000 by the end of the decade.{{cite:7}} Farms operated by tenants increased by 12% over decade as well, from 14% to 26%.{{cite:8}} In some cases, owners were away fighting the war. In many others, absentee owners brought in outsiders or non-land owners to farm the soil and cash in on the short term opportunity.'
        },
        {
            'start_year': '1925',
            'end_year': '1925',
            'title': '1925',
            'content': 'When the price bubble finally burst the financial disaster nearly ruined the state. Sudden deflation crashed land prices. The total value of farm property dropped by one-third, the shattering losses were estimated to be over half a billion dollars. In order to build and maintain the infrastructure that had been built during the war years total property taxes collected rose 250%, from $11,000,000 in 1912 to $27,000,000 in 1922. The heavy tax burden coupled with the declining value of farm land pushed many North Dakotans further into debt and ultimately bankruptcy.'
        },
        {
            'start_year': '1925',
            'end_year': '1925',
            'title': '1925',
            'content': 'If this were not enough the decade following the 20\'s would prove to be even worse. The 20\'s had been characterized by the popping of the economic bubble that brought the state to its knees, the 30\'s was the kick while they were down. Wheat prices fell lower than anyone thought possible, only 37 cents per bushel.{{cite:9}} With prices at all-time lows North Dakotans had to continue to plant large quantities of wheat to try to pay their debts. This over production with under consumption was a vicious cycle that forced prices down further.'
        },
        {
            'start_year': '1926',
            'end_year': '1926',
            'title': '1926',
            'content': 'To add to the economic cycle that crippled the state the 30\'s suffered from natural abnormalities the state had never experienced before. Mother Nature turned on the state pushing the spirits of the people even lower. Drought set in, strangling the life out of the state. In 1933 the state only received 13.5 inches of rain, the fourth driest on record.{{cite:10}} The following year a scant 9.5 inches of precipitation, the driest year recorded up to that time.{{cite:11}} There was a small reprieve from the drought in 1935 but 1936 was even drier with only 8.8 of rain. Hearty as the wheat plant is the drought severely stunted the growth making life harder for the state.'
        },
        {
            'start_year': '1927',
            'end_year': '1927',
            'title': '1927',
            'content': ' Temperatures soared to extremes on both ends of the spectrum. Reaching 100 degrees became a normal part of summer life in the state. 1936 proved to be the climax of these temperature variations recording not only the hottest day on record in the state to that point but also the coldest. Mid February the town of Parshall recorded their actual temperature at -60F, not including wind chill.{{cite:12}} In contrast Steele only a few months later in July recorded their temperature at 121F.{{cite:13}}'
        },
        {
            'start_year': '1928',
            'end_year': '1928',
            'title': '1928',
            'content': 'With the strong winds of North Dakota coupling with these extreme temperatures made most agricultural practices in the area nearly impossible. The hot dry weather dried out the soil and was swept away by the winds, creating dust storms destroying crops. The heat and dust storms also wreaked havoc on the cattle ranches in the western end of the state. Ranchers struggled to keep their herds hydrated and fed. Many cattle simply dropped dead from inhalation of dust, suffocating from the very air around them. If your herd made it through the summer months to the winter a whole new set of challenges arose. Food became more and more difficult to find. With the growing season decimated the state wasn\'t able to save enough food to feed themselves let alone herds of livestock. Many ranchers sold their herds off only retaining their prized breeding stock feeding them whatever they could find.'
        },
        {
            'start_year': '1929',
            'end_year': '1929',
            'title': '1929',
            'content': 'The capstone to the destruction of the state was the grasshoppers. Pembina and Adams counties were the first to be hit in 1931.{{cite:14}} The grasshopper plague continued to spiral out of control. What little the farmers could grow was devoured by swarms of insects. In Killdeer grasshoppers piled up four inches deep, blanketing the town.{{cite:15}} In another instance the town of Mott had to turn on their street lamps in the middle of the day because the swarm of grasshoppers had blotted out the sun. This shadow was cast all over the state.'
        },
        {
            'start_year': '1930',
            'end_year': '1930',
            'title': '1930',
            'content': 'The economic system had collapsed and even Mother Nature had turned its back on the state. The Great Depression caused havoc across the US but drought, plague, and weather combined to make North Dakota particularly unbearable. Spirits were low, the weather the worse and many saw no way out. Yet a light was at the end of the tunnel. With another World War soon on the way North Dakota would reclaim its rightful place as wheat providers to the United States. '
        }],
        'citations': [
            'Saloutos, "The Spring-Wheat Farmer in a Maturing Economy 1870-1920" 184.',
            'Robinson, History of North Dakota, 369.',
            'Saloutos, "The Spring-Wheat Farmer in a Maturing Economy 1870-1920", 177.',
            'Saloutos, "The Spring-Wheat Farmer in a Maturing Economy 1870-1920", 178.',
            'Saloutos, "The Spring-Wheat Farmer in a Maturing Economy 1870-1920", 179.',
            'Robinson, History of North Dakota, 369',
            'IBID',
            'IBID',
            'Tweton, Jerome. North Dakota: The Heritage of a People, (Fargo: North Dakota Institute for Regional Studies, 1976) 155',
            'Robinson, History of North Dakota, 38',
            'IBD',
            'Robinson, History of North Dakota, 399',
            'Robinson, History of North Dakota, 398 ',
            'IBID',
            'Tweton, Jerome. North Dakota: The Heritage of a People. 155'
        ],
        'bibliography': [
            'Saloutos, Theodore. "The Spring-Wheat Farmer in a Maturing Economy 1870-1920." The Journal of Economic History 6: 173-190. http://www.jstor.org/stable/2113082 (accessed May 1, 2014).',
            'Robinson, Elwyn B. History of North Dakota, (Fargo: North Dakota Institute for Regional Studies, 1995)',
            'Tweton, Jerome. North Dakota: The Heritage of a People, (Fargo: North Dakota Institute for Regional Studies, 1976)',
            'World War I on the Home Front, (Films for the Humanities and Sciences. DVD, 2006)'
        ]
    }]
};

nosql.on('load', function() {
    nosql.insert([
        chapter1,
        chapter2
    ]);
});
