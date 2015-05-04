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
                        'url': 'url',
                        'backgroundLayers': [],
                        'toggleableLayers': []
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

var themeAnthro = {
    'slug': 'anthropology',
    'name': 'Anthropology of the State',
    'chapters': [{
        'slug': 'map',
        'name': 'Anthropology of the State',
        'blurb': 'Visual representation of the anthropology of North Dakota.',
        'type': 'map',
        'map': {
            'url': '//undgeography.und.edu/geographyund/rest/services/ND125/WebMapND125/MapServer',
            'backgroundLayers': [1, 15],
            'toggleableLayers': [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
            'legend': [{
                'icon': 'circle',
                'color': '#FF7F7F',
                'text': '1 dot = 3 Norwegians'
            },
            {
                'icon': 'circle',
                'color': '#0084A8',
                'text': '1 dot = 3 Germans'
            },
            {
                'icon': 'circle',
                'color': '#89CD66',
                'text': '1 dot = 3 Russians'
            },
            {
                'icon': 'circle',
                'color': '#000',
                'text': 'Major city'
            },
            {
                'icon': 'square',
                'color': '#97DBF2',
                'text': 'Water body'
            }]
        },
        'stories': [{
            'title': 'Before the State: The Dakota Territory',
            'citations': [
            ],
            'bibliography': [
            ],
            'sections': [{
                'content': 'Before North Dakota ever became a state and even before it was the Dakota Territory, the land that would eventually become a state was originally part of the Louisiana Purchase.  When President Thomas Jefferson purchased this land from the French in 1803, he sent for Meriwether Lewis to form an expedition to survey the recently purchased land, create diplomatic relations with the Native American tribes that they met, extend the fur trade network and find the Northwest Passage to the Pacific (Buckley 2014).  With the help of William Clark they put together a small team of soldiers and set sail along the Missouri River in 1804.  Along their journey they eventually came into contact with the Mandan and Hidatsa tribes near present-day Bismarck, North Dakota and hired the help of two interprets, French-Canadian Toussaint Charbonneau and his Shoshone wife Sakakawea, who helped the Lewis and Clark expedition immensely in navigating through a landscape that was completely new to them and helping establish relations with the local tribes they came into contact with (Buckley 2014).  The expedition came to an end in 1806 and has been considered one of the greatest American exploration endeavors in history. Clark’s maps were published in 1810 and were popularly used for over thirty years by future settlers and adventures looking for a new life in the West.'
            },
            {
                'content': 'Long before the Europeans started to migrate over into this area there were many American Indian groups that resided in modern-day North Dakota.  These groups included the Mandan, Hidatsa, Arikara, the Ojibwe and Cree, and the numerous groups of the Sioux tribe (Yankton, Yanktonai, Teton, Santee).  A variety of other ethnic groups also migrated to this area with the purpose of staking claim to land. These groups largely consisted of either French-Canadian fur traders that migrated down the Missouri River and from areas of Northern Minnesota, Central Canada, and from the Eastern region of the United States.'
            },
            {
                'content': 'The clashing of land claim presented a problem for the American Indians and the recent migrants to the area over who had a right to the farmlands. It is said that these disputes over land, among other political conflicts, led to the Sioux Wars that lasted for almost half a century, where battles such as Little Bighorn and Wounded Knee took place (Waldman 191). There were many native casualties due to the use of gun power by militant forces, as well as the spread of diseases, such as small pox. However, this was not a determiner of all battles fought. '
            },
            {
                'content': 'In 1858, General J.B.S Todd, and other members of the United States Army created a treaty that relocated many of the area’s tribes to designated regions. The Mandan, the Hidatsa and the Arikara were relocated to Fort Berthold; many Siouan tribes were relocated to the Standing Rock Indian Reservation, the Santee tribe to the Turtle Mountain Reservation and the Ojibwe to Spirit Lake Reservation.  '
            },
            {
                'content': 'Congress created a bill in 1861 that was signed by President James Buchanan, which organized the surrounding lands as the Dakota Territory (Foster 1928:7-8).   When many new settlers began to migrate towards the area with the prospect of finding gold in areas of Montana and South Dakota, tensions again began to rise between the Native Americans and the new area settlers. This led to the establishment of Army forts along the Missouri River. Then in 1876, Lieutenant Colonel George A. Custer led the 7th Cavalry from Fort Abraham Lincoln, in present-day Mandan, North Dakota, to fight off the Sioux, Arapaho, and Cheyenne tribes in Montana at the Battle of the Little Big Horn. Custer and the entire 7th Calvary were annihilated in the battle and it is still considered one of the greatest victories of the time (Waldman 191). The Sioux wars ended in 1890 with the Battle of Wounded Knee in South Dakota. There were a great many American Indian causalities, which led to the end of the wars (Waldman 196). '
            }] // sections
        },
        {
            'title': 'The Dakota Homestead',
            'citations': [
            ],
            'bibliography': [
            ],
            'sections': [{
                'content': 'The United States Federal government officially organized the Dakota Territory and appointed William Jayne as its first governor by President Lincoln in 1861 and a year later the territory was opened for homestead. When the Homestead Act of 1862 was passed a large number of settlers came the Dakota Territory to acquire land given out by the government. The Homestead Act allowed the possession of land as long as the land was farmed and sustained a plentiful crop, contributing to the food production for the nation. As the years progressed the Northern Pacific Railway (NPRR) and Great Northern Railway (GNRR), along with homesteaders increased the population of the northern Dakota Territory. In 1880 Military reserves were also opened for homestead in the eastern and central portion of the northern Dakota. By 1915 over seventy-nine percent of North Dakotas population were either immigrants or children of immigrants.'
            }]
        },
        {
            'title': 'North Dakota’s Statehood: The Division of a Territory',
            'citations': [
            ],
            'bibliography': [
            ],
            'sections': [{
                'content': 'After population “boom” in the Dakota Territory because the homestead and the transcontinental railway, bills were summited for the addition of North and South Dakota into the union. On November 2, 1889, President Benjamin Harrison approved North and South Dakota’s statehood as the 39th and 40th states. It is said that President Harrison selected from the two bills at random for which to sign first because of the intense rivalry between the North and the South at the time. It was not recorded which he signed first. At its inception North Dakota was a republican state and its first governor, John Miller, fought popular issues of the time. '
            }]
        },
        {
            'title': 'Norwegians',
            'citations': [
            ],
            'bibliography': [
            ],
            'sections': [{
                'content': 'Of the many ethnicities that make up North Dakota Norwegian Americans make up a large portion of the population. There is not a real clear date as to when the first Norwegian settlers arrived, but many speculate that it was around 1860-1870 near the Wild Rice River in Cass County near what is now Abercrombie and Hickson, North Dakota (Sherman et al. 1988: 188). So why are there such great numbers of Norwegian Americans in North Dakota? Some believe it was the unclaimed farmlands in the area that draw many from Minnesota and Iowa. There is also reason to believe that many Norwegians left Europe during mass democratic reform. Groups known for their “grass roots movement” removed themselves from the Old World and immigrated to America for change and expansion (Sherman et al. 1988:185). 	'
            },
            {
                'content': 'Many Norwegians and Norwegian Americans migrated toward Devils Lake between 1883-1886 and eventually expanded out to present-day Benson and Bottineau. Benson was known as a Norwegian American population center and Bottineau was almost a solid concentration of Norwegian farmlands (Sherman et al. 1988:189). In 1915, the North Dakota Board of Immigration went out of its way to invite more northern Europeans to the state. '
            },
            {
                'content': 'What is interesting to point out about the Norwegian population is that they have a sense of loyalty and cultural unity with one another. In 1885, the Scandinavian Temperance Society was organized with Swedish Americans and in 1889 the Scandinavian Republican League was formed to get voter recognition for Norwegian voters. Norwegian Americans also made a point to closely match their New World homes to that of Norway. The town of Northwood and surrounding towns were known as “halling towns”, referencing the region of Hollingal in Norway. Farmsteads of Cooperstown have also been known to show cultural similarities to the area of Stavanger in Norway (Sherman et al. 1988:190). '
            },
            {
                'content': 'Even after many years the Norwegian culture still thrives in Norwegian communities. Poetry has shown to be a popular form of recording the early life of settlers in the state. Norwegian Americans in North Dakota are also one of the few ethnic groups in the state to memorialize themselves in statues. The 1970’s in North Dakota were a sort of cultural renaissance for Norwegian Americans. One of the many things to come out of this period was the reemergence of the Sons of Norway lodges such as the Hjemkomst Center in Fargo-Moorhead and the Sons of Norway lodge in Grand Forks. Gyde Vorden Lodge was the first Sons of Norway lodge to be founded in North Dakota in 1903. Many of these lodges were popular with Norwegian Americans for multiple years, however by the end of World War I the number of members began to dwindle. But in recent years membership has begun to increase. The Hostfest in Minot has also been a popular Norwegian cultural event that promotes much of the early immigrant’s culture and way of life through festival activities and music, such as performances by choral societies and fiddling. '
            }]
        },
        {
            'title': 'Germans',
            'citations': [
            ],
            'bibliography': [
            ],
            'sections': [{
                'content': 'In the early history of North Dakota there were many Germans that came to the state of North Dakota as trappers, explorers, and migrant workers before Germans settled permanently in the area. One of the earliest known German settlements in the state was the Selkrik Colony, which was comprised of forty-five German and Swiss migrants. In this group was the artist Peter Rindisbacher, possibly the first German artist to depict the North Dakota Indians (Sherman et al. 1988:64). In 1833, Alexander Philip Maximilian, a pioneer ethnographer, and Karl Bodmer, a painter, set out to explore the area, surveying the land and the people. A couple of years after the Civil War, Peter B. Davy along with a group of German immigrants followed suit surveying the upper Dakota Territory and by 1870 Germans began to create permanent residency in North Dakota (Sherman et al. 1988:64-5). '
            },
            {
                'content': 'Much of reasoning behind German immigration was similar to other Western/Eastern European ethnic groups: political inequality, economic distress, and the want for freedom from oppressive governments. When the German immigrant groups finally made it over from Europe they joined up with the NPRR and church organizations to help to transition themselves into the newly founded state of North Dakota (Sherman 1983:14). '
            },
            {
                'content': 'When World War I broke out in Europe, Germans were heavily persecuted throughout the state and became targets for suspicion. As their loyalty was questioned, many Germans decided to Americanize their names to avoid harassment and solidify their allegiance (Sherman 1988:85). There was even the talk, at the time, of changing the state capital Bismarck to something “less German”. '
            },
            {
                'content': 'Much like Norwegian Americans, German Americans also had different cultural groups and organizations. In 1881, one of the first German institutions was established in Jamestown; this group was the Jamestown Turnverein (named for Turnverein, a strenuous physical gymnastic exercise) (Sherman et al. 1988:93-4). Another group that became famous was the Sons of Hermann, named after a successful Roman officer from a Germanic tribe. This group was formed to preserve the culture and language of Germany. The first Sons of Hermann lodge was started in New Salem in 1907 (Sherman et al. 1988:96). The Schutzen Verein, another popular German organization, was a non-violent shooting society that performed drills and military maneuvers for festivals and celebrations.'
            }]
        },
        {
            'title': 'Ukrainians',
            'citations': [
            ],
            'bibliography': [
            ],
            'sections': [{
                'content': 'The Ukrainians who immigrated to America did so due to the poor conditions in the Ukraine at the time. There was widespread economic distress and many farmers were forced to sharecrop with neighboring nations like Russia and Poland. The first wave of immigrants from the Ukraine came around 1896 to Stark County in Western North Dakota. There was a steady stream of Ukrainian immigrants coming into the state up until 1912, spreading into Billings County. '
            },
            {
                'content': 'Ukrainians tend to be split geographically between different religious practices. Western Ukrainians are more involved with the Uniate Catholic Church or Greek Orthodox, while Eastern Ukrainians are usually from Protestant groups. These religious groups were important to maintaining cultural heritage when immigrants began to settle in homesteads in North Dakota. '
            }]
        },
        {
            'title': 'Native Americans',
            'citations': [
            ],
            'bibliography': [
            ],
            'sections': [{
                'content': 'Before the establishment of the reservations, life for the Native Americans was organized and integrated to protect, nurture and help individuals to help overcome the hardships of living in the prairie (Schneider 1990:24).  Even before the arrival of the Lewis and Clark expedition, the Europeans have made a devastating impact on the American Indians.  Many products like horses, guns and steel tools really reshaped how the Native Americans lived and interacted with other tribes.  Horses from New Mexico for example made buffalo hunting much easier and migrating to new lands quicker.  Many of these goods however came at a significant cost.  As many of the Native Americans were becoming fonder of goods such as cloth, vermillion, glass beads and other goods, it led to overhunting buffalo for trade goods and increased tribal warfare (Schulenberg 1956:81).'
            },
            {
                'content': 'The American government made an assault on the Native Americans to force them to abandon their “savagery” and to become “civilized” the passing of legislations like the Indian Civilization Act of 1819 and Indian Territory Act of 1830 (Gagnon 2009:169).  The Dawes Allotment Act of 1887 was also another devastating blow to the American Indian culture.  This act, forced them to abandon the common usage of the tribal land and force them to become private landowners (Gagnon 2009:170). '
            },
            {
                'content': 'Even through many of the hardships that the Native American community endured, their rich cultural traditions continue to live on.  Many of their traditional ceremonies were integrated into American holidays like the Fourth of July (Braun 2009:180).  This American Indians also adapted Christianity into many of the religious practices (Braun 2009:180).  This tended to annoy the missionaries in the area because they believed it undermined their efforts to convert them.'
            },
            {
                'content': 'The Native Americans are considered one of the oldest ethnic groups to inhabit the Americas.  In the state of North Dakota there are multiple tribes with a varying degree of cultural practices, beliefs and languages.  There are the Gardening Tribes, which consist of the Arikara, Hidatsa, and Mandan; the Seven Council Fires that include the Dakota, Lakota, Yankton and Yanktonai; and the Turtle Mountain Band of Chippewa.  This supplemental text will serve as a brief overview for the three Siouan tribes of the Dakota, Lakota and the Nakota.  We will also look at the early history of the Standing Rock Reservation, which encompasses both Sioux County, North Dakota and Corson County, South Dakota.  '
            }]
        },
        {
            'title': 'The Sioux',
            'citations': [
            ],
            'bibliography': [
            ],
            'sections': [{
                'content': 'The name Sioux is one that is commonly known in this part of the country.  What many people may not know is that the Sioux comprise of many different tribal groups including the Dakota, Teton, Yankton and Yanktonai.  Each of these groups make up different Siouan dialect regions throughout the surrounding area, all of the divisions of Siouan speakers were originally known as Oceti Sakowin or Seven Council Fires.  This council refers to their seven political structures: the Western group Teton; the Eastern group of Sisseston, Wahpeton, Wahpekut and Mdwakouton; and the Central group of Yankton and Yanktonai (Pritzker 1998:452).  The band chiefs and clan leaders of these tribes met annually with other members of the Seven Council Fires to socialize and discuss matters of importance. The name “Sioux” is believed to have derived from the Chippewa word Nadouessioux, meaning “adders” or “lesser enemy.” (Waldman 2009:191).  Even though the name Sioux is commonly used in historical and anthropological literature when describing these tribal groups, many view this as a very derogative term (O’Leary and Levinson 1991:349).  However, other tribes have different meanings to the name, for example the Dakota (another Siouan tribe) translate the meaning as “ally” or “free people” (Pritzker 1998:452). '
            }]
        },
        {
            'title': 'The Dakota',
            'citations': [
            ],
            'bibliography': [
            ],
            'sections': [{
                'content': 'Many of the Dakota tribes varied among one another.  Some were more suited for the subsistence farming of corn, squash and beans along the rivers while other tribes were more suited for hunting.  The deer and buffalo were major food animals for the Dakota as well as rabbits and muskrats.  The gathering of food resources strongly influenced the lifestyle of the tribe all year long.  In autumn, deer hunting parties would go out to gather meats to dry for the winter.  When winter came, muskrats were hunted in place of deer and the sugar processing occurred.  Then in the summer, planting and berry picking was practiced until harvest time and the process began all over again when fall came again (Schneider 1994:80). '
            },
            {
                'content': 'Many of the Dakota tribes were organized in political structure of permanent villages.  Many did not split into multiple hunting parties as much like the Lakota and structured under a hereditary chieftainship as long as the successor qualified.  If the individual does not qualify, usually a council would convene and appoint a new chief (Schneider 1994:80).'
            },
            {
                'content': 'The religion of the Dakota was a complex system known as Wakan Tanka.  In this belief, man and nature were not viewed as competing forces, but rather as elements in the same system (Schneider 1994:81).  The Dakota were also known to practice two major ceremonies known as the Medicine Dance and the Sun Dance.  In the Medicine Dance, people are initiated into the ability to cure and to the sacred mysteries of the medicine men (Schneider 1994:82).  The version of the Sun Dance practiced by the Dakota is much more informal than what is practiced by the Lakota.  This would be due to the fact that many Dakota did not generally believe in self-sacrificing.  If they did practice the self-sacrificing aspect, enduring the pain of the Sun Dance prepared them for the pain of life that would come as a medicine man or warrior (Schneider 1994:82).          '
            }]
        },
        {
            'title': 'The Lakota',
            'citations': [
            ],
            'bibliography': [
            ],
            'sections': [{
                'content': 'Many believed that the Lakota originated from the Black Hills from South Dakota.  However due to the archaeological records and oral traditions, the origins of Lakota claim that they migrated out of Minnesota in the 1600s (Schneider 1994:82).  Unlike the Dakota, the Lakota were generally a mobile tribe that migrated constantly across the plains.  They lived in non-permanent settlements known as tiospaye, or camps.  Each of these tiospaye were further divided into smaller camps that represented extended family (Schneider 1994:82).  The tipis and other similar structures represented the nuclear family for the Lakota, and followed a strict etiquette when living in the tipi.  Women sat on the left of the door, while men sat on the right.  A place of honor was reserved for guests facing the door of the tipi, and no one passed between the fire and a person sitting by the fire (Schneider 1994:82).  '
            },
            {
                'content': 'A major food source for the Lakota was the buffalo.  Many ceremonies were conducted in honor of the buffalo such as worshiping the White Buffalo Cow Woman, which was an important religious figure that brought the sacred pipe and the seven ceremonies to the Lakota.  As part of their religious practices, which included worshipping the great spirit of Wakantanka, they recognized that too much of any good thing was bad.   They wanted to bring balance to the universe, and in order to do that they practiced the seven ceremonies which included: the sweat lodge, keeping the ghost, seeking a vision, sun dancing, making relatives, preparing a girl for womanhood and the sacred pipe ceremony (Schneider 1994:83). '
            },
            {
                'content': 'The Sun Dance was very integral to the Lakota.  This was a four-day ceremony filled with dances and prayers seeking continuation of the buffalo and safety of the people.  This ceremony was very controversial to Euro-Americans because they believed that the self-sacrificing aspect of piercing one skin with skewers tied to poles was torture imposed on their youth, but actually represented a way of restoring harmony to the universe as well as provide strength to their people and secure the protection of the sacred beings (Schneider 1994:85).   '
            }]
        },
        {
            'title': 'The Nakota (Yankton and Yanktonai)',
            'citations': [
            ],
            'bibliography': [
            ],
            'sections': [{
                'content': 'The Nakota is the Central group that includes the Yankton (“end village”) and Yanktonai (“little end village”).  Scholars believe that these groups resided along the north-end of the Mississippi River extending even as far as Texas.  The Yankton and Yanktonai were originally one tribe.  But due conflicts with the Cree and Ojibwa as well as migrating buffalo to the plains, they are believed to have separated near Leech Lake in the late 17th Century.  The Yankton moved towards the pipestone quarries of the Southeast, while the Yanktonai left Mille Lacs by the early 18th century to follow the Teton tribe who were going west (Pritzker 1998:490). '
            },
            {
                'content': 'The Yanktonai were also divided between each other as well.  The Upper Yanktonai were consisted of six different bands, and the Hunkpatina (Lower Yanktonai) had seven bands.  The Lewis and Clark Expedition located this group along the headwaters of the Sioux, James, and Red Rivers (Schulenberg 1956:23).  Many Yankton and Yanktonai have achieved success as artists (Pritzker 1998:491).  '
            }]
        },
        {
            'title': 'Standing Rock Reservation',
            'citations': [
            ],
            'bibliography': [
            ],
            'sections': [{
                'content': 'Standing Rock Reservation is one of the largest reservations in land area, but not in population (Schneider 1994:147).  Early in its establishment from the Treaty of Fort Laramie in 1851, Standing Rock was part of the Great Sioux Nation.  The Great Sioux Nation originally included all of South Dakota that was west of the Missouri River, part of western North Dakota, eastern Montana and Wyoming, and western Nebraska.  Then in 1868 the land was reduced to all of South Dakota west of the Missouri River.  '
            },
            {
                'content': 'The Lakota were strongly opposed to the intrusion of white settlers and soldiers in their land, so many took up arms and began what was to be known as the “Sioux Wars” which took place during five different periods, which included events such as the Battle of Little Big Horn and Battle of Wounded Knee.  The U.S. government held the Lakota responsible for the acts claiming that they violated the treaty; this led to further division and separation of the Great Sioux Nation (Schneider 1994:148).  '
            },
            {
                'content': 'Most of the reservations residents were tribal members of the Yanktonai, Hunkpapa, Ogala and other smaller groups.  From 1906 to 1915 the U.S. began the process of land allotment for those looking to set up farmlands and residencies in North Dakota; this led to even further loss of land for the Native Americans.  By the late 20th Century, Standing Rock Reservation contained roughly 847,799 acres, 300,000 of which are tribally owned (Pritzker 1998:479).  The Standing Rock Reservation has a history of maintaining cultural integrity relative isolation by resisting federal funds.  Many members, such as the Deloria family, have achieved national and international prominence as writers, teachers, activists and leaders (Pritzker 1998:491).'
            }]
        },
        {
            'title': 'Where Do We Go From Here?',
            'citations': [
            ],
            'bibliography': [
            ],
            'sections': [{
                'content': 'From the general research and ethnic specific information we have collected on North Dakota, we are looking forward to expanding our working in the semester to come. With an emphasis on self-identity we hope to uncover cultural tradition, family histories, and ethnic change, which will add to our story of the history and change of North Dakota for its 125th anniversary. With the help of Dr. Reed, we plan on traveling to many locations in North Dakota for our research. The goal is to be able to interview multiple members of a single family who have all remained life-long residents of North Dakota, to more easily chart change from the 1950’s to present-day. We plan on video and voice recording the interviews in the hopes of including them on the interactive site. '
            },
            {
                'content': 'As a group, we are very interested in the role of self-identity in collecting and interpreting ethnic based data. As time passes and later generations begin to move further from their ancestral roots ideas of self begin to shift and change. There are many factors that contribute to one’s own self-identity: place, religion, schooling, and family traditions, to name a few. Self-identity is not something that is easy to measure because classification can be so person specific. We hope to have a deeper look into self-identity and better understand what informs self-identity for some residents of North Dakota. With the state’s rich history of immigration and with many recent immigrant groups, we see a wealth of potential in this project, which can hopefully be added to long after our work is completed.  '
            }]
        }] // stories
    }] // chapters
}; // themeAnthro

/* HISTORY */
var themeHistory = {
    'slug': 'history',
    'name': 'History of the State',
    'chapters': [{
        'slug': 'map',
        'name': 'Making of the State to Current',
        'blurb': 'Visual representation of the history of North Dakota spanning from the First World War through current, with corresponding narratives.',
        'type': 'map',
        'map': {
            'url': '//undgeography.und.edu/geographyund/rest/services/ND125/WebMapND125/MapServer',
            'backgroundLayers': [17, 32],
            'toggleableLayers': [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
            'legend': [{
                'icon': 'circle',
                'color': '#F00',
                'text': '1 dot = 100 people'
            },
            {
                'icon': 'circle',
                'color': '#000',
                'text': 'Major city'
            },
            {
                'icon': 'square',
                'color': '#97DBF2',
                'text': 'Water body'
            }]
        },
        'stories': [{
            'title': 'Making of the State',
            'start_year': '1890',
            'end_year': '1909',
            'citations': [
            ],
            'bibliography': [
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
            }] // sections
        },
        {
            'title': 'North Dakota in the First World War',
            'start_year': '1910',
            'end_year': '1919',
            'citations': [
            ],
            'bibliography': [
            ],
            'sections': [{
                'content': 'North Dakota will always be a monoculture. North Dakota was founded on wheat and it forever will hold a special place to this land. Even before the creation of the state in 1889 North Dakota had been the biggest producer of Wheat in the country. By the end of the World War I this small state, only 2% of the US land mass, produced approximately 30% of the entire wheat supply in the United States.'
            },
            {
                'content': 'The population density of North Dakota is incredibly low. In 1910 the state boasted a population of 557,056, with 93% of these people living in rural areas. For every square mile there were no more than 6 people on average inhabiting it. Often, these 6 people were a family. People lived miles apart on separate farms and competed with one another to produce more than their neighbors. The towns were small normally stood as a meeting place for church and store runs on Sundays.'
            },
            {
                'content': 'Given the great distances and unpredictable climate travel was incredibly difficult for much of the year. This type of isolation leads to a particular breed of people. North Dakota farmers tended to be extremely self-reliant and distrustful of formal organization. Highly motivated and driven by competition between themselves, these men had migrated to forge their own path under the Homestead Act. When it was enacted in 1862 the Great Plains flooded with farmers who began to till their 160 acres of free land. This boom in population fed the problem by creating a large competition between farmers. “There were too many farmers; they were hard to organize and even harder to keep organized; they often spoke different languages, were spread over great distances, lacked business acumen, were discouraged by past failures, often did not understand the need for organization, and were without capital and allies.”.'
            },
            {
                'content': 'Pride for a farmer was measured by his individual production of wheat. In 1910 over a half of the counties in the state produced more the one million bushels of wheat making them “wheat millionaires”. This was a highly sought after title for an area and the farmers took pride in making their area as productive as possible. Groups associated with farming such as the Better Farming Association of North Dakota reflected this ideology of increased production on a larger scale by producing articles and tips on how to grow more wheat, gain more land, and make more money. Focus was on increased production, the idea of sustainability was never really considered. '
            },
            {
                'content': 'However, when the war final broke out North Dakotans answered the nations call. The State of North Dakota was number one in the US when the draft statistics were released for fighting fitness. 77.5% of its men were considered to be “fit to fight”, 7% higher than the national average and 24% higher than the lowest state in the US. North Dakota also boasted a 2% desertion rate, compared to the 3.5% for the rest of the nation. Just as they had always shown, North Dakotans were tough, resilient, and loyal.'
            },
            {
                'content': 'Yet even with North Dakotan men standing fast and not deserting their obligations only 160,292 men were sent into the service. However, as small as this number is in a literal sense it sent nearly 15% of its entire population to help win the war. This created a huge shortage of the young male population which normally manned the fields. The state struggled to find ways to make up for the loss of labor. '
            },
            {
                'content': 'The day after America entered the war Governor Lynn Fraizer urged remaining farmers and their families to plant every acre they could to meet the needs of the war. North Dakotans were expected to increase the amount of wheat production even with many of its men fighting in the war. . Once again, the North Dakota farmer was called to do more with less, to sacrifice more for a cause at the expense of his own well-being.'
            },
            {
                'content': 'The sudden need for more food also introduces future president Herbert Hoover to the stage. As head of the US Food Administration, Hoover quickly becomes one of the power players in the fate of the North Dakota farmers.'
            },
            {
                'content': 'When America joined the war in 1917 Hoover was called home from overseas where he was aiding the Belgians and placed at the head of the US Food Administration. Formed by President Wilson in August of 1917, the US Food Administration was charged with three goals:'
            },
            {
                'content': 'Assure the supply, distribution, and conservation of food during the war, Facilitate transportation of food and prevent monopolies and hoarding, and Maintain governmental power over foods by using voluntary agreements and a licensing system.'
            },
            {
                'content': 'In addition to carrying out the stated goals, Hoover immediately called for an increase of production in all sectors of American agriculture. With its hearty and robust nature wheat production was put at the top of the list of crops to be increased. Since it could last the long sea voyages once it was dried it was the logical choice to send across the Atlantic to feed the American Expeditionary Force. Once again, North Dakota farmers were asked to do more than their fair share and they responded. '
            },
            {
                'content': 'Hoover puts into place a new propaganda campaign that is tailored to tug at the heart strings of the wheat farmers of North Dakota. He begins to depict the farmer as the savior of the nation. The message begins to be spread on both the local and national level that North Dakota farmers’ production of wheat is going to be the back bone of the entire war effort. The wheat that North Dakotans were expected to produce would feed our troops fighting on the front lines, our starving European Allies in Belgium, England, France and finally American families on the home front. '
            },
            {
                'content': 'On the local level cartoons and articles were run in newspapers that depicted farmers as heroes. Sometimes the messages were positive, highlighting the plight of the farmer and the hardy work that he did for the nation. One such cartoon, entitled A Hero of the Trenches depicts a solidly built farmer at the helm of his plow; his hat pulled down as his bandana blows back in the North Dakotan wind. His clothes are simple with the sleeves of his shirt rolled up. Behind him in the background a dust cloud looms. Yet he presses on. Inscribed on the dirt arising from his plow are the words, Greater Yield Per Acre. Drawings such as this began to appear all over the papers, filling farmers with a sense of responsibility and duty to which farmers promptly answered.  '
            },
            {
                'content': 'It is estimated that 300,000 acres of land were added to the productive farm land of the state in this way. However, hidden in that open offer was the need to invest in more infrastructure and equipment to accomplish the task.'
            },
            {
                'content': 'As stated previously, the total amount of land used to cultivate wheat increased as the war raged in Europe. In 1916 a grand total of 12,200,000 acres were under cultivation for wheat. By 1917 that number had risen to 14,085,000 acres and by 1919 there were 15,417,000 acres being cultivated in the state. Yet the total yield of the crops varied from year to year simply because of North Dakota’s climate. Drought ravaged the state greatly affecting the total number of bushels produced. “The wheat crop was poor in 1916, 1917, and 1919” averaging only 50,000,000 to 60,000,000 bushels of wheat in total production.  1917 was the driest year that North Dakota had seen since statehood. It would only be passed in the 1930s during the Dust Bowl which historians and climatologist call the greatest ecological disaster of the twentieth century. However, not all the years yielded poor crops. For instance in 1914 and 1919 the state produced an average wheat crop of around 100,000,000 bushels. Only in 1915 did the state’s full agricultural might truly show. During that season a record breaking 159,000,000 bushels were grown. '
            },
            {
                'content': 'In conclusion North Dakota truly answered the nations call during the First World War. Their robust independent natures helped the United States win the war, toiling away all the while taking economic losses. By the end of the war many farmers were deep in debt from purchasing land and materials to increase production. The First World War was a time for the state to show its true might to the rest of the United States and it had completed that task. Although they had fed the world a new era of hardship loomed.  The massive amount of debt, extreme cultivation, and a demobilizing nation were mixing to create the perfect storm against the farmers. '
            }] // sections
        },
        {
            'title': 'The Depression',
            'start_year': '1920',
            'end_year': '1938',
            'citations': [
            ],
            'bibliography': [
            ],
            'sections': [{
                'content': 'The war was now over. Celebrations occurred across the nation as troops poured back into the country. The 1920s were poised to be a decade of elegance and abundance. North Dakota also rejoiced as their boys came home. Farmers were ready to continue to feed the world and enjoy the high demands that were expected of them but it was not to be so. The end of the World War One marked a sharp downturn for the state. While the rest of the country enjoyed parties and luxuries courtesy of easy to obtain credit North Dakotans were already in a deep recession, only to be dragged down even further when the stock market finally crashed. This Depression lasting more than 20 years nearly ruined the state. '
            },
            {
                'content': 'When Europe produced an abundance of grain the year following the end of the war and other countries continue to export wheat to remaining European buyers, farmers came face to face with an abundance of wheat in a highly competitive market. When the price controls were removed the flooded market crashed. Prices went from an average of $2.35 a bushel in 1919 down to $1.01 in 1921. Unfortunately, in that perfect storm the North Dakotans couldn\'t just cut their losses and run. Everything they owned, as a result of the rapid expansion, was tied to the banks. The very land and way of life that these immigrants had traveled to attain was now hanging by a thread. All the state could do was try to break even by continuing to produce larger and larger amounts of wheat.'
            },
            {
                'content': 'To cash in on high wheat prices during the war years many farmers cultivate as much land as possible. As a result demand for acreage coupled with wartime inflation temporarily pushed land prices higher. In 1910 a farmer could purchase land for $26 per acre. By 1920 that price had risen to $35 and that was for land that was left over: an increase of about $160 by today’s standards. Without proper understanding of basic sustainable agricultural methods or second thoughts to the fertility of the soil, cost of seed or cost of increased labor, farmers bought up huge tracts of land for inflated prices. Easily obtained credit fueled the new investments. After all, it was national policy to put more acres under the plow. '
            },
            {
                'content': 'Many farmers “preferred to keep their original purchase encumbered in order to have money to buy additional lands.”  Many of these loans were taken out with interest rates in excess of 8%. By 1916 the region’s interest rates on short term loans (loans due back in 3 to 12 months) were the highest in the nation at 10.75%. With this kind of debt load any misfortune in this house of cards could cause collapse: drought, flood, hail, locust, price drop or even a family illness. The Federal Farm Loan Act of 1916 capped interest rates at 6% but by the time it was enacted most of the damage was already done.'
            },
            {
                'content': 'Accompanying the increase in loans to buy up more land was an increase in homestead farm mortgages and an increase in non-owner tenants. In 1910 half of the farms in North Dakota were mortgaged by their owners. By 1920 that rate had swollen to 71%. The mortgage debt in North Dakota more than doubled during the period of 1910-1919 in sync with national efforts to ramp up wartime production. Starting at $48,000,000 the debt ballooned to $108,000,000 by the end of the decade. Farms operated by tenants increased by 12% over decade as well, from 14% to 26%. In some cases, owners were away fighting the war. In many others, absentee owners brought in outsiders or non-land owners to farm the soil and cash in on the short term opportunity. '
            },
            {
                'content': 'When the price bubble finally burst the financial disaster nearly ruined the state. Sudden deflation crashed land prices. The total value of farm property dropped by one-third, the shattering losses were estimated to be over half a billion dollars. In order to build and maintain the infrastructure that had been built during the war years total property taxes collected rose 250%, from $11,000,000 in 1912 to $27,000,000 in 1922. The heavy tax burden coupled with the declining value of farm land pushed many North Dakotans further into debt and ultimately bankruptcy. '
            },
            {
                'content': 'If this were not enough the decade following the 20’s would prove to be even worse. The 20’s had been characterized by the popping of the economic bubble that brought the state to its knees, the 30’s was the kick while they were down. Wheat prices fell lower than anyone thought possible, only 37 cents per bushel. With prices at all-time lows North Dakotans had to continue to plant large quantities of wheat to try to pay their debts. This over production with under consumption was a vicious cycle that forced prices down further. '
            },
            {
                'content': 'To add to the economic cycle that crippled the state the 30’s suffered from natural abnormalities the state had never experienced before. Mother Nature turned on the state pushing the spirits of the people even lower. Drought set in, strangling the life out of the state. In 1933 the state only received 13.5 inches of rain, the fourth driest on record. The following year a scant 9.5 inches of precipitation, the driest year recorded up to that time.There was a small reprieve from the drought in 1935 but 1936 was even drier with only 8.8 of rain. Hearty as the wheat plant is the drought severely stunted the growth making life harder for the state.'
            },
            {
                'content': 'Temperatures soared to extremes on both ends of the spectrum. Reaching 100 degrees became a normal part of summer life in the state. 1936 proved to be the climax of these temperature variations recording not only the hottest day on record in the state to that point but also the coldest. Mid February the town of Parshall recorded their actual temperature at -60°F, not including wind chill. In contrast Steele only a few months later in July recorded their temperature at 121°F.'
            },
            {
                'content': 'With the strong winds of North Dakota coupling with these extreme temperatures made most agricultural practices in the area nearly impossible. The hot dry weather dried out the soil and was swept away by the winds, creating dust storms destroying crops. The heat and dust storms also wreaked havoc on the cattle ranches in the western end of the state. Ranchers struggled to keep their herds hydrated and fed. Many cattle simply dropped dead from inhalation of dust, suffocating from the very air around them. If your herd made it through the summer months to the winter a whole new set of challenges arose. Food became more and more difficult to find. With the growing season decimated the state wasn’t able to save enough food to feed themselves let alone herds of livestock. Many ranchers sold their herds off only retaining their prized breeding stock feeding them whatever they could find. '
            },
            {
                'content': 'The capstone to the destruction of the state was the grasshoppers. Pembina and Adams counties were the first to be hit in 1931. The grasshopper plague continued to spiral out of control. What little the farmers could grow was devoured by swarms of insects. In Killdeer grasshoppers piled up four inches deep, blanketing the town. In another instance the town of Mott had to turn on their street lamps in the middle of the day because the swarm of grasshoppers had blotted out the sun. This shadow was cast all over the state.'
            },
            {
                'content': 'The economic system had collapsed and even Mother Nature had turned its back on the state. The Great Depression caused havoc across the US but drought, plague, and weather combined to make North Dakota particularly unbearable. Spirits were low, the weather the worse and many saw no way out. Yet a light was at the end of the tunnel. With another World War soon on the way North Dakota would reclaim its rightful place as wheat providers to the United States.'
            }] // sections
        },
        {
            'title': 'North Dakota and World War II',
            'start_year': '1939',
            'end_year': '1959',
            'citations': [
            ],
            'bibliography': [
            ],
            'sections': [{
                'content': 'From 1939 to 1945 the state of North Dakota felt the impacts of World War Two on it’s population. The changes North Dakota saw in population from the late 1930s to the early 1950s were due to the demand for military personnel in response to World War Two and the economic changes brought on by a nation at war. With these population shifts the State also saw changes in the states social, political and economic sectors.'
            },
            {
                'content': 'If we examine the raw numbers, we can see how the population changed due to World War 2. In 1930 the state boasted a population of 680,845. Unsurprisingly, the 1940s census shows that the population dropped to 641,935. This was due in no small part to the depression and dust bowl conditions that hurt the agriculture economy nation wide (North Dakota’s main commodity). Come 1950 however, the population dropped again to 619,636. This drop may seem contrary to the nation’s growth, the wartime economy and the increase North Dakota saw as a state in its agriculture economy. Surely if it was poor farming that drove them away, then good farming would bring them back?'
            },
            {
                'content': 'So why did so many leave from 1940 to 1950? The obvious answer seems to be men at war. The nation demanded men to fight in both fronts (European and Pacific), but North Dakota entered the decade with much the same mindset they had in World War One; that of isolationism. These views evolved as the state progressed throughout the decade however,. The most concrete proof of this change is the numbers of those in the service as time marched on. In 1941 roughly 4,200 men were in service, and that number rose to 46,000 by 1944, echoing that change in sentiment.'
            },
            {
                'content': 'That said; a draw of service was certainly not what took most men from their homes in the 1940s. In fact only 34% of those eligible to join were in service by 1944, as compared to the national average of 41%. This made North Dakota the second lowest contributor of soldiers and sailors in the nation (coming in only just ahead of South Carolina). This was due to the deferment the state offered to many of North Dakota’s eligible men. Some 50,000 draftees were initially deferred due to farm work. The Federal government banned this method of deferment for many in 1944 and this helped increase the amount of men serving in uniform. The result was a grand total of 38,000 men from North Dakota being drafted, 20,600 enlisting in some branch of the military, and a total of 1,939 North Dakotans dying in World War Two. Many of the men that did leave for war ended up returning to the state for at least a short while to reunite with their families, an lend a hand on the farm.'
            },
            {
                'content': 'In addition to service, the war effort drew men (and women) into new workplaces during World War Two. The new defense industry was a huge job market that many North Dakotans took up in other states. Farming communities shrank from 325,000 in 1940 to 285,000 in 1945, and the number of farms in North Dakota dropped from 74,000 in 1940 to 69,500 in 1945. This all happened despite an overall growth in the farming industry, both in North Dakota, and Nationwide. '
            },
            {
                'content': 'These raw number do little however to show the impact of the Second World War on North Dakotans and are far less valuable without considering the social changes that brought these numbers, and the numbers these social changes wrought. Like it’s predecessor, the Second World War brought out North Dakota’s Isolationist views. In the fallout of “The Great War” Senator Nye of North Dakota petitioned against international involvement in a new conflict and spoke instead for the common farmers of North Dakota. He was a large supporter of a ban on arms trades with foreign nations in the mid 1930s and when those bans were repealed a few years later, all North Dakotan congressmen voted against it; reflecting their constituents views.'
            },
            {
                'content': 'This was not a lasting view however, as it had been in decades prior. Many North Dakotans were of Norwegian decent, including its Governor: John Moses. So when Germany invaded Norway in 1940, many first and second generation Americans who still had family in Norway developed an animosity toward Germany, and more open to the idea of aiding foreign nations. A relief fund for Norway was set up and roughly $46,000 was collected. It also drew some men to enlistment and service in the Army and Navy. '
            },
            {
                'content': 'A nation at war also brought political changes to North Dakota that warrant mention. As earlier stated, the general population was against international involvement in another war, and the political arena had the same sentiments. Many in the state opposed the assistance the federal government had offered the British. These feelings would eventually faded with public opinion as the politicians realized that the U.S. would indeed be drug into the struggle. '
            },
            {
                'content': 'Chiefly, the war brought more money to North Dakota, and with it a more conservative view on politics. The great depression had left North Dakota’s legislature very gun-shy when it came to spending. With an increase in demand for food world wide, The state helped meet the agricultural demands of the nation (which will be covered more in depth a little later) and filled their coffers in the process. The state’s debt fell from its peak of $23,000,000 in 1938 to $6,000,000 in 1945, and built a reserve of $54,000,000 in the same year.  On paper this makes for a very positive future for the state, no?'
            },
            {
                'content': 'The general feeling however, was that this prosperity would not last and that the state should be scrupulous in its spending. Governor Moses himself proposed many extremely conservative measures to the state to help it save money including a reduced legislature, a merit system for government employment and promotion, and to move treasury responsibilities from the school districts and townships to the county level. Ultimately none of these measures passed, but they were not without support and reflected the mentality that the state needed to prepare for the worst. '
            },
            {
                'content': 'Truly the biggest effects on the population were the economic changes that were brought to the state in the 1940s. Unlike the 1930s, personal income rose greatly in the first half of the decade. From 1940 to 1945 personal income rose 145% in ND, outshining that national average of 109%. Likewise, the average income shot up dramatically from an average of $350 in 1940 to $1009 in 1945. This growth came mostly from farming, which became wildly successful when the nation began to need to feed its troops. The market demand (and consequently the cost) of crops rose substantially. To make things even better, precipitation was above average and even set records across the state from 1940 to 1944. 1941 was the wettest year on record, creating a stark contrast to the decade prior.'
            },
            {
                'content': 'With high demand and good condition, farmers began producing more than ever in North Dakota averaging around 150,000,000 bushels. With this growth in production there was also a growth in demand for labor. Unfortunately this was  something the state quite frankly could not meet in many respects. As stated earlier, men and women were leaving for the service or the war industry, meaning there were less people to man the farms. The growth allowed many people to pull themselves out of debt, but like the government, depression had made the people of North Dakota far more conservative with their spending. Many homes in the 1940s did not have electricity, running water, or heating, and few were willing to put the money down to make those changes. Those that stayed instead purchased more farming equipment and vehicles to help move their product, with the hopes that they could build a nest egg to help them weather the next, unknown disaster.'
            },
            {
                'content': 'If we remember from the 1930s, new public works programs had been created to offer United States citizens a chance at earning themselves a living during the depression. This would lead to a large amount of once private land to be transferred to government ownership across the nation. North Dakota was no different, and with the dust bowl destroying many farmers American dreams, and their land being foreclosed upon. Consequently there was a bulk of land in North Dakota that was available at the beginning of the decade. Unfortunately, the state stopped offering up government owned land to the public as the decade progressed to allow returning service members a chance at farming. The price of land slowly rose, and many farmers began renting more land to farm rather than purchase (likely due to a fear of commitment to a career that had plummeted so quickly just a few years before.) This put many farmers across the state in the same predicament: Do you stay and farm the productive land, or do you sell off your farm and let someone else put the risk into the soil? The population drop across the state tells us what many chose. So despite what at a glance seems like a reason to stay, many in the agriculture business saw the 1940s as their way out.'
            },
            {
                'content': 'Instead many went into the new war industry that the nation had to offer. Unfortunately for the State, North Dakota received only $9,600,000 of $225,000,000,000 worth of war contracts, making it a pretty pitiful industrial state (In fact it received the smallest percentage of the governments war contracts). Because of this North Dakota decided needed to diversify its farming economy.  Governor Moses and the state legislature attempted this by developing its research and public planning opportunities within the state (new public planning was certainly something the state needed as most of its housing predated the 1920s). These ploys worked to some extent, but for the most part the draw was not greater than the opportunities many other states had to offer.'
            },
            {
                'content': 'As a nation at war, North Dakota felt the effects of World War Two on its population. North Dakota’s population fell despite the huge boost in the agriculture economy due to the social mindsets, government developments, and economic advantages of a wartime economy.'
            }] // sections
        },
        {
            'title': 'North Dakota\'s 1970 Energy Boom',
            'start_year': '1960',
            'end_year': '1989',
            'citations': [
            ],
            'bibliography': [
            ],
            'sections': [{
                'content': 'Starting in the 1970s, North Dakota saw a largely unlasting boost in population due to a national interest in Domestic oil and opportunities in the energy economy that North Dakota had to offer.'
            },
            {
                'content': 'From the 1960s to the 1980s North Dakota underwent a steady growth in population, capping off in around 1981 and then steadily declining into the 1990s. In the 1960 the population hit a slight crest of 632,446, dipped to 617,7761 in 1970, before rising to 652,717 in 1980, and eventually returning to its original watermark of 638,800 in 1990. This rise that can be observed stems from the energy boom in North Dakota, which was brought on by many an oil crisis throughout the 1970s.'
            },
            {
                'content': 'So who was coming to North Dakota? The growth can be attributed almost entirely to the increase in demand for energy. Mining companies and oil interests were drawn by North Dakota’s virtually untapped lignite and oil, which had previously been too expensive to harvest to be a cost effective option. The majority of these people it seems went to the major cities in North Dakota, thus boosting the populations of their respective counties substantially. For example; Burleigh County, which holds North Dakota’s state capitol Bismarck, grew from 34016 in 1960 to 40714 in 1970 and then to 54811 in 1980. Likewise Cass County, the largest in the state jumped from 66947 in 1960 to 73653 in 1970 and 88247 in 1980. In fact most counties that housed major cities saw growth from 1960 to 1990. This includes Grand Forks, Morton, and Stark County, which houses Grand Forks, Mandan, and Dickinson respectively. Additionally, the counties that held potential for lignite or oil energy like Bowman, Dickey, McKenzie, and Mercer saw fairly substantial increases in population as well.  Unlike, Burleigh, and Cass County however, these developing counties stopped developing when they energy boom ended. Bowman, Dickey, McKenzie and Mercer County all dropped in population from 1980-1990, as they offered little staying power without the national need for domestic energy.'
            },
            {
                'content': 'Lastly, all counties that were not associated with major cities or energy opportunities in the state dropped in population from 1960 to 1990. This is due to a few factors. Firstly, the farming industry that makes up the rural economy of North Dakota is unforgiving at best and people had been leaving the industry in mass quantities off and on since dust bowl. With new interests coming to the state, many had the opportunity to sell their land for a fair amount, and either move to the cities or move on to a different state.'
            },
            {
                'content': 'These numbers mean little however without considering the social impacts they had. Many of the prior North Dakota residents were concerned with the boom. The people of North Dakota were worried its lignite reserves would draw interests that would not consider the possible negative environmental impacts. This was especially true when it came to concerns over the future of agriculture in North Dakota, which was still the states main industry. Many felt the strip mining was largely unchecked entering the decade, and moved to regulate it, especially when it came to the reclamation of the land after it’s use. These laws eventually came to pass, much to the chagrin of the energy industry which of course were tasked with the burden of restoring the land to a usable state after the mining was complete.'
            },
            {
                'content': 'On top of the agriculture industry’s concerns, many businesses undertook the burden of a rapidly growing population. Small, family businesses were especially burdened as they took out many loans to keep up with the influx of people. When the oil was no longer cost effective to drill for, the population dropped (as seen in the 1990 census.)  As they emigrated, the demand for goods and services plummeted, leaving those who had taken out huge loans to deal with the boom no way to recoup the borrowed money.'
            },
            {
                'content': 'At the outset of the 1970s many in the political realm felt that the energy boom was a great opportunity and changed to accommodate the new sector accordingly.  Nationally, there was concern that the United States was too reliant on foreign energies. Governor William Guy in particular was very excited by the energy boom and heavily advocated out of state interests come and tap the states lignite reserves. Eventually the state drew in corporations to put up large open-pit mines, power plants, and the first coal to synthetic natural gas plant in the nation was built. With all this industry the state had drawn in the population increased, and with this draw of population, North Dakota’s legislature began the process of relaxing its “Blue Laws” to accommodate its new size. Starting midway through the second growth the state saw in 1979, North Dakota began to open the door to some forms of gambling. These opportunities would grow as the years progressed in an attempt to keep the growth the state had received after the boom ended. Additionally, the sale of liquor on Sundays became an option and traditional shopping laws that prohibited people from buying anything other than food on Sundays were gradually rolled back in an attempt to grow the states tourist industry. The small growth the state received in tourism was not even close to overcoming the drop in economics the state had as the energy industry made its way to the exit.'
            },
            {
                'content': 'The largest changes this population increase brought however, were economic. The energy interest nation wide had seen a huge increase in the price for oil, making drilling in North Dakota far more cost effective. Starting in 1973 prices rose from about $15 per barrel to $45 in 1974. Prices then began to fall steadily from 1974 and bottoming out in 1977 at around $35 per barrel. Then, 1979 oil boomed again, and the price had shot to a little over $70 per barrel.  These booms of course coincide with the oil embargos put in place by President Nixon, and the first Iraq/Iran occupations by the United States. '
            },
            {
                'content': 'Likewise, with the new scarcity of oil, coal presented itself as a viable substitute, and became an industry of interest in the 1970s. Unlike oil however, this industry was much more limited. Below surface mining was regulated in all facets by the “Coal Mine Health and Safety Act of 1969” which protected the workers of mines at the cost of the operators. North Dakota was uniquely poised to offer a solution to the coal industry however as it had a large amount of lignite coal, which is found much closer to the surface and can be accessed via strip mining. Since lignite is considered the bottom of the totem pole when it comes to coal due to its low heat yield it had been more or less ignored until now. Following this, the Nixon administration created the Environmental Protection Agency (EPA) in 1971 which would come to reduce the long term feasibility of strip mining in North Dakota, but it did create a short term window of opportunity in North Dakota that helps account for the states growth and subsequent shrinking in the 1980s and 1990s.'
            },
            {
                'content': 'Western North Dakota in particular became much more developed in the 1970s in an attempt to support the new interest. The states infrastructure was not at all prepared, and so dealing with this growth was left to the public sector in many ways (as earlier stated). This put many into debt, as they developed housing and travel options in the state, thinking that the growth would be sustained. Starting in 1981 however, the price of oil fell dramatically; reaching just over $20 per barrel in 1985 making North Dakota no longer feasible as far as drilling was concerned. The capital that energy had drawn left almost over night, and put the urban areas of the state in debt.'
            },
            {
                'content': 'To make matters worse, many had also been drawn into the agriculture economy around the same time as the energy boom, due to an increase in grain prices. With this increased interest, many people entered the market, driving up the price of land and machinery and ultimately putting many into debt trying to keep up. Overall, North Dakota’s economy suffered from the “growth” it had received in the 1970s.'
            },
            {
                'content': 'The energy boom of the 1970s created a vacuum in North Dakota and created a largely unsustained growth. This boom in the economy lasted into the beginning of the 1980s and can account for the growth and falling of the population that the census demonstrates.'
            }] // sections
        },
        {
            'title': 'North Dakota and the Bakken',
            'start_year': '1990',
            'end_year': '2013',
            'citations': [
            ],
            'bibliography': [
            ],
            'sections': [{
                'content': 'North Dakota residents have noticed a huge increase of people over the past decade. The state has had quite a bit of growth due to the Bakken Formation and the development of Hydraulic fracturing. This population increase has, for better or worse brought social, political, and economic changes. The question remains however, is this growth sustainable?'
            },
            {
                'content': 'As one would expect, North Dakota’s population has grown substantially since the development in the Bakken. Starting in 1990 the state boasted a modest 638,000, and grew steadily to 642,000 in 2000. Come 2010 however, the population shot to 672,591 and in 2013 it was estimated that the state had reached 723,393 people. More specifically, North Dakota has seen growth in very urban areas like Burleigh county (which houses Bismarck, grew from 69,416 in 2000 to 81,308 in 2010 and 88,457 in 2013), Cass county (the seat of Fargo rose from 123,138 in 2000 to 149,779 in 2010 and 162,829 in 2013), and Stark County (which holds Dickinson, grew from 22,636 in 2000 to 24,199 in 2010 and 28,990 in 2013). '
            },
            {
                'content': 'When looking at the counties that house the Bakken Formation however, the growth is not readily apparent until one considers the estimated populations of 2013. For example Billings, Golden Valley, and McKenzie County have populations of 888, 1,924, and 5737 respectively. Come 2010 Billings shrank to 783, Golden valley fell to 1,680 and McKenzie, grew to only 6,360. Hardly the boom one would expect with in the area that was supposedly bringing in so many people and so much money. However when we move to the 2013 numbers, all counties grow with Billings reaching 874, Golden Valley climbing to 2,823 and McKenzie rising to 9,314. '
            },
            {
                'content': 'Likely this phenomenon is due to the attitude many of those coming to the state had. Many felt the work was temporary and came to the state literally in RVs and campers, not expecting to stay for any long period. Many oil companies set up “man camps” to house the influx but the people staying there usually did not consider themselves North Dakotans. After all, the boom started in only 2007, so many could not have been there for more than a couple years. Come 2013 the mentality would change as the boom proved it was more sustained than it originally appeared. Those who had come earlier were now establishing some level of permanence and those that were now arriving felt more comfortable with permanent residence.'
            },
            {
                'content': 'Lastly, Williams county which houses Williston (the boom town itself) grew from 19,761 in 2000 to 22,398 in 2010 and 29,595 in 2013. Williston of course, is the city just north of the majority of the Bakken Formation where many oil interests have been drawn over the past decade.'
            },
            {
                'content': 'This huge growth that North Dakota has seen is due in no small part the Hydraulic Fracturing (referred to colloquially as “Fracking”) and no discussion of the growth would be complete without a basic knowledge of the process. Essentially Hydraulic Fracturing has allowed for access to oil that was previously too deep to tap (anywhere from 5,000 to 8,000 feet) and began being used on a massive scale starting in 2003. It involves sending a mixture of water and other chemicals through the ground to push fuel and natural gas from the shale to the surface. The crude oil is collected, as is a portion of the natural gas, leaving some of the gas to be “flared” off the top of the rig. Regulation on the disposal of the brine has changed since the start of the boom due to environmental concerns. It is also a very political topic with strong opinions on both sides. These will be largely left out, as the debate does not have much to do with the growth the state saw, though it is not entirely without merit.'
            },
            {
                'content': 'With this growth the state has underwent many social changes came as well, the most obvious being the growth in work opportunities. Many in the state with entry-level jobs left the service industry and moved to the oil patch. This created an increase in demand for servers, cashiers, and the like and left many businesses struggling to keep up. In response, wage offerings in the service industry grew substantially, as did prices for many household goods and an overall inflation in the western part of the state. Because of this however, North Dakota boasts the lowest unemployment in the nation at just 2.7% as of December 2013.'
            },
            {
                'content': 'Additionally, hydraulic fracturing developed a negative opinion with some of the western portion of the state due to concerns that the brine was not properly being disposed of. As of 2011 there were over 1,000 spills of the wastewater according to a self-report from the industry. Likewise many in the public have been disturbed by the amount of flaring that the rigs have been subject to, as it has produced enough light pollution to be seen from space.'
            },
            {
                'content': 'The biggest social change however is the change in crime the state has seen. In 1999, 445 violent crimes and 14,590 property crimes were committed in North Dakota. In 2007, the year of the boom more or less began, violent crime increases to 885, but property crime drops to 12,531. In fact while violent crime had been trending upward in starting in about 2005, the amount of property crime had actually been falling from 1999 on. Come 2013, violent crime in the state has almost doubled again reaching a total of 1,558, the majority of which was assault. Likewise the total amount of property crime started rising again in 2009 after reaching an all time low in 2008. By 2013, property crimes have reached an all time high of 15,685. Additionally, while the number of juveniles committing crimes has been steadily falling since 2008, the number of adults committing crimes has been on the rise since 2004, making up over 75% of those arrested by 2013.'
            },
            {
                'content': 'With new people comes need for policy changes of course, and so the political landscape changed with the literal landscape of the state. As earlier stated, many concerns about the environmental impacts of hydraulic fracturing have arisen. Specifically, many were concerned about the quality of the ground water, and whether or not the brine could have contaminated drinking water in the western part of the state. As a result the EPA has begun testing water sources near wells to determine if they are having an impact. Additionally, before drilling the state stipulates certain well designs and drilling procedures to account for safety of both the rigs and the water. The state also has specific isolation requirements for the disposal of waste-water, requiring that it be a certain distance from all water sources (in 2009 flooding in the state moved waste water out of their storage pits and had contaminated parts of the state).'
            },
            {
                'content': 'With the increase in people and job openings in the state, North Dakota is also one of the only states in the union to be operating on a surplus budget as opposed to a deficit. This has led to a conflict over what to spend the extra money on. Many in the state legislature feeling that it should simply be put into a rainy day fund but those in the western portion of the state feel that the money would best be put to use investing in infrastructure. All major cities across the state have grown substantially due to the boom but Williston has by far exceeded its intended capacity. Road quality has degraded and class sizes in primary schools have ballooned, as the state currently does not have adequate facilities for the growth.'
            },
            {
                'content': 'Lastly, and most obviously, the boom has had major effects on the economy. North Dakota has universally seen a drop in unemployment and the western portion has been effected by wage inflation. The new industry has created around 46,000 jobs and the average wage in the new energy industry is roughly $90,000 annually, as compared to the state’s average of $37,353.'
            },
            {
                'content': 'As of 2011 about 12.3% of the states GDP was drawn from the energy industry and changes in oil prices have a profound effect on the states income. The petroleum industry has brought about $1.5 billion in taxable purchases and a $1 change in the price of a barrel of oil will increase or decrease the states revenue by $9.3 million as of 2011. This has raised the question of stability of the boom, but current estimates assume that as long as the price of oil remains above $50 per barrel, the boom will last. '
            },
            {
                'content': 'This has led to North Dakota becoming the 4th largest oil producing state in the nation, but that doesn’t mean that there isn’t room for improvement. Currently about 72% of the natural gas was collected while the rest was flared off. This extra gas accounts for about 350 million cubic feet per month and is worth about $100 million dollars. The state plans reaching 90% by 2020, a number many other states have already reached or overcame. Additionally, as production has increased so has the cost of production in North Dakota however. In 2009 the average well cost about $5.6million but by 2011 that cost rose to $10 million.'
            },
            {
                'content': 'As such it can be seen that the social, political and economic changes brought by the influx of people have created an environment of growth in the state, but the question of sustainability hinges on the long-term need for oil of the nation and world. '
            }] // sections
        }] // stories
    }] //chapters
}; // themeHistory

// insert our themes
nosql.on('load', function() {
    nosql.insert([
        themeHistory,
        themeAnthro
    ]);
});

/**
// Chapter 1 with just text
var chapter1 = {
    'slug': 'making-of-the-state',
    'name': 'Making of the State',
    'blurb': 'Most of what would become the Dakota Territory was originally purchased in 1803 from the French. Although the Louisiana Purchase opened up the west for Americans much of the northern areas of the purchase were left untouched for nearly a half a century. The land that would become North Dakota were left to fur traders and native tribes but the soon to be North Dakota would experience massive changes in a short period of time and propel itself on the course to statehood. There were two major factors that launched North Dakota on the track to statehood, the milling industry in Minneapolis and the construction of the Northern Pacific railroad through the state.',
    'stories': [{
        'type': 'map',
        'map': {
            'url': '//undgeography.und.edu/geographyund/rest/services/ND125/WebMapND125/MapServer',
            'backgroundLayers': [],
            'toggleableLayers': [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]
        },
        'title': 'Population for ${NAME}, ${YEAR}',
        'text': '${*}',
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
        'map': {
            'url': '//undgeography.und.edu/geographyund/rest/services/ND125/WebMapND125/MapServer',
            'backgroundLayers': [],
            'toggleableLayers': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
        },
        'type': 'map',
        'title': 'Ancestry for ${NAME}, ${YEAR}',
        'text': '${*}',
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

**/
