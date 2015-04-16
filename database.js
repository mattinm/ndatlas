/**
 * This script creates our database.
 *
 * @author Marshall Mattingly
 */
var nosql = require('nosql').load(__dirname+'/database.nosql');

nosql.on('load', function() {
    nosql.insert(
    [{
        'title': 'The Making of the State',
        'type': 'text',
        'sections': [{
            'content': 'Most of what would become the Dakota Territory was originally purchased in 1803 from the French. Although the Louisiana Purchase opened up the west for Americans much of the northern areas of the purchase were left untouched for nearly a half a century. The land that would become North Dakota were left to fur traders and native tribes but the soon to be North Dakota would experience massive changes in a short period of time and propel itself on the course to statehood. There were two major factors that launched North Dakota on the track to statehood, the milling industry in Minneapolis and the construction of the Northern Pacific railroad through the state.'
        },
        {
            'content': ' By 1870 Minneapolis had become the biggest milling city in the United States. Using new technology the millers had found a way to create a better product. Producing spring wheat flour the bran (which was very brittle) breaks into small pieces and become very hard to sift out of the product.{{cite:1}} This made spring wheat flour less desirable then the easier to sift winter wheat, therefore making it less profitable. The millers from Minneapolis discovered a way to eliminate the bran issue by importing specialized porcelain rollers instead of milling stones that crushed wheat in a more controlled uniform fashion.{{cite:2}} This way the wheat could be crushed without completely shattering the bran.'
        },
        {
            'content': ' Armed with this new technology and the power produced by St. Anthony’s Falls Minneapolis expanded exponentially. Mills were being built even though a large majority of wheat in Minnesota and Wisconsin (mostly winter wheat) was already promised to other milling hubs such as Chicago and Milwaukee.{{cite:3}} Mills at times were forced to shut down due to lack of wheat. This problem needed to be addressed and the millers turned to the Dakota Territory.'
        },
        {
            'content': ' The Dakota Territory was very isolated from the rest of the US for most of the 1800s. It wasn’t until 1870 that the first tracks of the Northern Pacific Railroad were laid down in the state. The Northern Pacific was designed to connect the Twin Cities with the rich wheat lands of the Dakotas, as well as to the Pacific Ocean at Seattle.{{cite:4}} When the project was commissioned the company received a vast land grant to finance the creation of the tracks. 40 miles of land was awarded on either side of the proposed tracks, a total area that equates to 1.5X the size of North Dakota itself.{{cite:5}} Stock holders had the option to exchange stock holdings for land that was equal to the land of the stock.'
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
        }],
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
        ]
    }]);
});
