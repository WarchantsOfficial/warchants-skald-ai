# Salefinder – Expo Snack Setup

Bitte erstelle folgende Dateistruktur in Expo Snack (snack.expo.dev) exakt so:

```
App.js
package.json
screens/Feed.js
screens/Map.js
screens/Profile.js
screens/Post.js
```

---

## package.json

```json
{
  "dependencies": {
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "react-native-screens": "~3.29.0",
    "react-native-safe-area-context": "4.8.2"
  }
}
```

---

## App.js

```javascript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FeedScreen from './screens/Feed';
import MapScreen from './screens/Map';
import ProfileScreen from './screens/Profile';
import PostScreen from './screens/Post';

const C = { bg: '#0d0d0f', accent: '#ff5c35', muted: '#888899' };
const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }) {
  const icons = { Feed: 'home', Map: 'map', Post: 'add', Search: 'search', Profile: 'person' };
  const labels = { Feed: 'Feed', Map: 'Karte', Post: '', Search: 'Suchen', Profile: 'Profil' };
  return (
    <View style={s.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const isPost = route.name === 'Post';
        return (
          <TouchableOpacity key={route.key} onPress={() => navigation.navigate(route.name)} style={s.tabItem}>
            {isPost ? (
              <View style={s.postBtn}>
                <Ionicons name="add" size={28} color="#fff" />
              </View>
            ) : (
              <>
                <Ionicons
                  name={isFocused ? icons[route.name] : `${icons[route.name]}-outline`}
                  size={24}
                  color={isFocused ? C.accent : C.muted}
                />
                <Text style={[s.label, { color: isFocused ? C.accent : C.muted }]}>
                  {labels[route.name]}
                </Text>
              </>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Feed" component={FeedScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Post" component={PostScreen} />
        <Tab.Screen name="Search" component={() => (
          <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: C.muted, fontSize: 16 }}>Suche kommt bald 🔍</Text>
          </View>
        )} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const s = StyleSheet.create({
  tabBar: {
    flexDirection: 'row', backgroundColor: '#0d0d0f',
    borderTopWidth: 1, borderTopColor: '#2a2a35',
    paddingBottom: 20, paddingTop: 8, height: 72,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  label: { fontSize: 10, fontWeight: '500' },
  postBtn: {
    width: 50, height: 50, borderRadius: 16, backgroundColor: '#ff5c35',
    alignItems: 'center', justifyContent: 'center', marginTop: -20,
  },
});
```

---

## screens/Feed.js

```javascript
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const C = { bg:'#0d0d0f', surface:'#16161a', surface2:'#1e1e24', border:'#2a2a35', accent:'#ff5c35', accent2:'#ffb800', text:'#f0f0f0', muted:'#888899', green:'#2ecc71' };

const DEALS = [
  { id:1, cat:'mystery', store:'Ravensburger Shop', icon:'🎲', loc:'180m · Mariahilfer Str.', badge:'🎁 Mystery Box', badgeColor:C.accent2, title:'Mystery Boxes sind wieder da!', desc:'Gerade entdeckt — Ravensburger hat Mystery Boxes! Verschiedene Größen, Inhalt unbekannt.', price:'€14,99', oldPrice:null, discount:null, poster:'nico_deals', time:'vor 2 Std.', likes:24, comments:[{user:'LisaShops',text:'Danke für den Tipp! 🏃'},{user:'KarlMystery',text:'Die mit blauem Etikett sind am besten!'}] },
  { id:2, cat:'tech', store:'Saturn', icon:'📱', loc:'320m · Mariahilfer Str.', badge:'🔥 Deal', badgeColor:C.accent, title:'Samsung Galaxy S25 −30%', desc:'Heute nur! Galaxy S25 für €699 statt €999. Nur solange Vorrat reicht.', price:'€699', oldPrice:'€999', discount:'−30%', poster:'MaxTechDeals', time:'vor 4 Std.', likes:61, comments:[{user:'Sandra_Deals',text:'Bestätigt! Noch ~15 Stück da.'}] },
  { id:3, cat:'food', store:'Billa Plus', icon:'🛒', loc:'410m · Neubaugasse', badge:'✨ Neu', badgeColor:C.green, title:'Wochenangebote gestartet', desc:'Ribeye Steak −40%, Ben & Jerrys 2+1 gratis, Avocados 3 für €2.', price:null, oldPrice:null, discount:null, poster:'Sandra_Deals', time:'vor 6 Std.', likes:38, comments:[{user:'nico_deals',text:'Das Steak war ein Traum 🥩'}] },
  { id:4, cat:'mode', store:'Zara', icon:'👗', loc:'600m · Kärntner Str.', badge:'🔥 Sale', badgeColor:C.accent, title:'End of Season Sale bis −50%', desc:'Sommer-Kollektion massiv reduziert. Größen werden weniger!', price:'ab €9,99', oldPrice:null, discount:null, poster:'LisaShops', time:'vor 1 Tag', likes:92, comments:[{user:'Sandra_Deals',text:'Jeans-Abteilung ist top 👖'}] },
  { id:5, cat:'tech', store:'MediaMarkt', icon:'🖥️', loc:'500m · Mariahilfer Str.', badge:'🔥 Deal', badgeColor:C.accent, title:'MacBook Air M3 Knaller!', desc:'MacBook Air 13" M3 für €1.099 — niedrigster Preis in Wien! Nur noch 3 Stück.', price:'€1.099', oldPrice:'€1.299', discount:'−15%', poster:'MaxTechDeals', time:'vor 12 Std.', likes:118, comments:[] },
];

const FILTERS = ['Alle','🎁 Mystery','🍔 Food','💻 Tech','👗 Mode'];
const FILTER_CATS = ['all','mystery','food','tech','mode'];

function DealCard({ deal }) {
  const [liked, setLiked] = useState(deal.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(deal.comments);

  return (
    <View style={s.card}>
      <View style={s.storeRow}>
        <Text style={s.storeIcon}>{deal.icon}</Text>
        <View style={{flex:1}}>
          <Text style={s.storeName}>{deal.store}</Text>
          <Text style={s.storeLoc}>📍 {deal.loc}</Text>
        </View>
        <View style={[s.badge, {backgroundColor: deal.badgeColor+'22', borderColor: deal.badgeColor+'55'}]}>
          <Text style={[s.badgeText, {color: deal.badgeColor}]}>{deal.badge}</Text>
        </View>
      </View>
      <View style={s.content}>
        <Text style={s.title}>{deal.title}</Text>
        <Text style={s.desc}>{deal.desc}</Text>
        {deal.price && (
          <View style={s.priceRow}>
            <Text style={s.priceNew}>{deal.price}</Text>
            {deal.oldPrice && <Text style={s.priceOld}>{deal.oldPrice}</Text>}
            {deal.discount && <View style={s.discountPill}><Text style={s.discountText}>{deal.discount}</Text></View>}
          </View>
        )}
      </View>
      <View style={s.actions}>
        <TouchableOpacity style={s.actionBtn} onPress={() => { setIsLiked(!isLiked); setLiked(isLiked ? liked-1 : liked+1); }}>
          <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={20} color={isLiked ? C.accent : C.muted} />
          <Text style={[s.actionCount, {color: isLiked ? C.accent : C.muted}]}>{liked}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.actionBtn} onPress={() => setShowComments(!showComments)}>
          <Ionicons name="chatbubble-outline" size={18} color={C.muted} />
          <Text style={[s.actionCount, {color:C.muted}]}>{comments.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.actionBtn}>
          <Ionicons name="share-social-outline" size={18} color={C.muted} />
        </TouchableOpacity>
        <Text style={s.time}>{deal.time}</Text>
      </View>
      {showComments && (
        <View style={s.commentsBox}>
          {comments.map((c,i) => (
            <View key={i} style={s.comment}>
              <View style={[s.commentAv, {backgroundColor: C.accent+'33'}]}>
                <Text style={{color:C.accent,fontSize:10,fontWeight:'700'}}>{c.user[0]}</Text>
              </View>
              <View style={s.commentBody}>
                <Text style={s.commentUser}>@{c.user}</Text>
                <Text style={s.commentText}>{c.text}</Text>
              </View>
            </View>
          ))}
          <View style={s.addComment}>
            <TextInput
              style={s.commentInput}
              placeholder="Kommentar..."
              placeholderTextColor={C.muted}
              value={comment}
              onChangeText={setComment}
            />
            <TouchableOpacity style={s.sendBtn} onPress={() => {
              if(comment.trim()) { setComments([...comments,{user:'nico_deals',text:comment}]); setComment(''); }
            }}>
              <Text style={{color:'#fff',fontSize:12,fontWeight:'700'}}>Senden</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

export default function FeedScreen() {
  const [activeFilter, setActiveFilter] = useState(0);
  const filtered = activeFilter === 0 ? DEALS : DEALS.filter(d => d.cat === FILTER_CATS[activeFilter]);
  return (
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Aktuelle Deals 🔥</Text>
        <Text style={s.headerSub}>Wien & Umgebung</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterRow} contentContainerStyle={{paddingHorizontal:16,gap:8}}>
        {FILTERS.map((f,i) => (
          <TouchableOpacity key={i} style={[s.chip, activeFilter===i && s.chipActive]} onPress={() => setActiveFilter(i)}>
            <Text style={[s.chipText, {color: activeFilter===i ? C.accent : C.muted}]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView contentContainerStyle={{padding:16,gap:14,paddingBottom:100}}>
        {filtered.map(d => <DealCard key={d.id} deal={d} />)}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header:{padding:16,paddingBottom:8,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  headerTitle:{color:C.text,fontSize:18,fontWeight:'700'},
  headerSub:{color:C.muted,fontSize:12},
  filterRow:{maxHeight:48,marginBottom:4},
  chip:{paddingHorizontal:14,paddingVertical:6,borderRadius:20,borderWidth:1.5,borderColor:C.border,backgroundColor:C.surface},
  chipActive:{borderColor:C.accent,backgroundColor:C.accent+'1A'},
  chipText:{fontSize:13,fontWeight:'500'},
  card:{backgroundColor:C.surface,borderRadius:16,borderWidth:1,borderColor:C.border,marginBottom:2},
  storeRow:{flexDirection:'row',alignItems:'center',gap:10,padding:14,paddingBottom:8},
  storeIcon:{fontSize:22},
  storeName:{color:C.text,fontSize:14,fontWeight:'600'},
  storeLoc:{color:C.muted,fontSize:12},
  badge:{paddingHorizontal:10,paddingVertical:4,borderRadius:20,borderWidth:1},
  badgeText:{fontSize:11,fontWeight:'700'},
  content:{paddingHorizontal:14,paddingBottom:10},
  title:{color:C.text,fontSize:15,fontWeight:'700',marginBottom:4},
  desc:{color:C.muted,fontSize:13,lineHeight:18},
  priceRow:{flexDirection:'row',alignItems:'center',gap:10,marginTop:8},
  priceNew:{color:C.accent,fontSize:20,fontWeight:'800'},
  priceOld:{color:C.muted,fontSize:13,textDecorationLine:'line-through'},
  discountPill:{marginLeft:'auto',backgroundColor:C.accent,paddingHorizontal:10,paddingVertical:3,borderRadius:20},
  discountText:{color:'#fff',fontSize:12,fontWeight:'700'},
  actions:{flexDirection:'row',alignItems:'center',padding:12,borderTopWidth:1,borderTopColor:C.border,gap:16},
  actionBtn:{flexDirection:'row',alignItems:'center',gap:4},
  actionCount:{fontSize:13,fontWeight:'600'},
  time:{marginLeft:'auto',color:C.muted,fontSize:11},
  commentsBox:{padding:14,paddingTop:0},
  comment:{flexDirection:'row',gap:8,marginBottom:8},
  commentAv:{width:26,height:26,borderRadius:13,alignItems:'center',justifyContent:'center'},
  commentBody:{backgroundColor:C.surface2,borderRadius:10,padding:8,flex:1},
  commentUser:{color:C.accent2,fontSize:11,fontWeight:'700'},
  commentText:{color:C.text,fontSize:12,marginTop:2},
  addComment:{flexDirection:'row',gap:8,alignItems:'center',marginTop:4},
  commentInput:{flex:1,backgroundColor:C.surface2,borderRadius:20,paddingHorizontal:12,paddingVertical:6,color:C.text,fontSize:12,borderWidth:1,borderColor:C.border},
  sendBtn:{backgroundColor:C.accent,borderRadius:20,paddingHorizontal:14,paddingVertical:7},
});
```

---

## screens/Map.js

```javascript
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet, SafeAreaView } from 'react-native';

const C = { bg:'#0d0d0f', surface:'#16161a', surface2:'#1e1e24', border:'#2a2a35', accent:'#ff5c35', accent2:'#ffb800', text:'#f0f0f0', muted:'#888899', green:'#2ecc71' };

const NEARBY = [
  { id:'ravensburger', icon:'🎲', name:'Ravensburger Shop', sub:'Mariahilfer Str. · Mystery Boxes!', dist:'180m', deals:2, address:'Mariahilfer Str. 85', items:[{n:'🎁 Mystery Box S',p:'€14,99'},{n:'🎁 Mystery Box L',p:'€29,99'},{n:'🧩 Puzzle 1000er',p:'€19,99'}], verified:false },
  { id:'saturn', icon:'📱', name:'Saturn', sub:'Mariahilfer Str. · Smartphone-Aktion', dist:'320m', deals:5, address:'Mariahilfer Str. 2', items:[{n:'📱 Samsung Galaxy S25',p:'€699 (−30%)'},{n:'🎧 Sony WH-1000XM5',p:'€249'},{n:'💻 MacBook Air M3',p:'€1.099'}], verified:true },
  { id:'billa', icon:'🛒', name:'Billa Plus', sub:'Neubaugasse · Wochenangebote', dist:'410m', deals:4, address:'Neubaugasse 12', items:[{n:'🥩 Ribeye Steak',p:'−40%'},{n:'🍦 Ben & Jerrys',p:'2+1 gratis'},{n:'🥑 Avocados',p:'3 für €2'}], verified:true },
  { id:'zara', icon:'👗', name:'Zara', sub:'Kärntner Str. · End of Season Sale', dist:'600m', deals:3, address:'Kärntner Str. 28', items:[{n:'👖 Jeans',p:'ab €19,99'},{n:'👗 Kleider',p:'−50%'}], verified:true },
];

const PINS = [
  { id:'ravensburger', label:'🎲 Mystery!', color:C.accent2, left:'35%', top:'30%' },
  { id:'saturn', label:'📱 −30%', color:C.accent, left:'62%', top:'25%' },
  { id:'billa', label:'🛒 4 Deals', color:C.accent, left:'22%', top:'58%' },
  { id:'zara', label:'👗 Sale', color:C.accent, left:'70%', top:'62%' },
];

export default function MapScreen() {
  const [shop, setShop] = useState(null);

  return (
    <SafeAreaView style={{flex:1, backgroundColor:C.bg}}>
      <ScrollView contentContainerStyle={{padding:16, paddingBottom:100}}>
        <Text style={s.title}>📍 Deals in deiner Nähe</Text>
        <View style={s.mapBox}>
          <View style={[s.street, {top:'45%',left:0,right:0,height:1}]} />
          <View style={[s.street, {left:'50%',top:0,bottom:0,width:1}]} />
          <View style={s.userDot} />
          {PINS.map(p => (
            <TouchableOpacity key={p.id} style={[s.pin, {left:p.left, top:p.top}]} onPress={() => setShop(NEARBY.find(n=>n.id===p.id))}>
              <View style={[s.pinBubble, {backgroundColor:p.color}]}>
                <Text style={s.pinText}>{p.label}</Text>
              </View>
              <View style={[s.pinTail, {borderTopColor:p.color}]} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.sectionTitle}>IN DER NÄHE</Text>
        {NEARBY.map(n => (
          <TouchableOpacity key={n.id} style={s.nearbyItem} onPress={() => setShop(n)}>
            <Text style={{fontSize:24}}>{n.icon}</Text>
            <View style={{flex:1}}>
              <Text style={s.nearbyName}>{n.name}</Text>
              <Text style={s.nearbySub}>{n.sub}</Text>
            </View>
            <View style={{alignItems:'flex-end', gap:4}}>
              <Text style={s.nearbyDist}>{n.dist}</Text>
              <View style={s.dealsPill}><Text style={s.dealsPillText}>{n.deals} Deals</Text></View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={!!shop} transparent animationType="slide" onRequestClose={() => setShop(null)}>
        <TouchableOpacity style={s.modalBg} activeOpacity={1} onPress={() => setShop(null)} />
        {shop && (
          <View style={s.sheet}>
            <View style={s.handle} />
            <View style={s.sheetHeader}>
              <Text style={{fontSize:32}}>{shop.icon}</Text>
              <View style={{flex:1}}>
                <Text style={s.sheetName}>{shop.name}</Text>
                <Text style={s.sheetAddr}>📍 {shop.address}</Text>
                {shop.verified && (
                  <View style={s.verifiedBadge}>
                    <Text style={s.verifiedText}>✓ Verifizierter Händler</Text>
                  </View>
                )}
              </View>
            </View>
            <Text style={s.sectionTitle}>AKTUELLE DEALS</Text>
            {shop.items.map((item,i) => (
              <View key={i} style={s.dealItem}>
                <Text style={s.dealItemName}>{item.n}</Text>
                <Text style={s.dealItemPrice}>{item.p}</Text>
              </View>
            ))}
            <TouchableOpacity style={s.routeBtn} onPress={() => setShop(null)}>
              <Text style={s.routeBtnText}>Route starten 🗺️</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  title:{color:'#f0f0f0',fontSize:18,fontWeight:'700',marginBottom:14},
  mapBox:{height:220,backgroundColor:C.surface2,borderRadius:16,borderWidth:1,borderColor:C.border,marginBottom:20,overflow:'hidden',position:'relative'},
  street:{position:'absolute',backgroundColor:C.border},
  userDot:{position:'absolute',top:'44%',left:'49%',width:14,height:14,borderRadius:7,backgroundColor:'#4a9eff',borderWidth:2.5,borderColor:'#fff'},
  pin:{position:'absolute',alignItems:'center',transform:[{translateX:-30},{translateY:-40}]},
  pinBubble:{paddingHorizontal:8,paddingVertical:4,borderRadius:8},
  pinText:{color:'#fff',fontSize:11,fontWeight:'700'},
  pinTail:{width:0,height:0,borderLeftWidth:5,borderRightWidth:5,borderTopWidth:7,borderLeftColor:'transparent',borderRightColor:'transparent'},
  sectionTitle:{color:C.muted,fontSize:11,fontWeight:'700',letterSpacing:1,marginBottom:10,marginTop:4},
  nearbyItem:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:C.surface,borderRadius:12,padding:12,marginBottom:10,borderWidth:1,borderColor:C.border},
  nearbyName:{color:C.text,fontSize:14,fontWeight:'600'},
  nearbySub:{color:C.muted,fontSize:12,marginTop:2},
  nearbyDist:{color:C.accent,fontSize:13,fontWeight:'700'},
  dealsPill:{backgroundColor:C.accent,borderRadius:20,paddingHorizontal:8,paddingVertical:2},
  dealsPillText:{color:'#fff',fontSize:11,fontWeight:'700'},
  modalBg:{flex:1,backgroundColor:'rgba(0,0,0,0.6)'},
  sheet:{backgroundColor:C.surface,borderTopLeftRadius:20,borderTopRightRadius:20,padding:20,paddingBottom:40},
  handle:{width:36,height:4,backgroundColor:C.border,borderRadius:2,alignSelf:'center',marginBottom:16},
  sheetHeader:{flexDirection:'row',gap:14,alignItems:'flex-start',marginBottom:16},
  sheetName:{color:C.text,fontSize:18,fontWeight:'700'},
  sheetAddr:{color:C.muted,fontSize:13,marginTop:2},
  verifiedBadge:{backgroundColor:'#2ecc7122',borderWidth:1,borderColor:'#2ecc7155',borderRadius:20,paddingHorizontal:10,paddingVertical:3,marginTop:6,alignSelf:'flex-start'},
  verifiedText:{color:C.green,fontSize:12,fontWeight:'600'},
  dealItem:{backgroundColor:C.surface2,borderRadius:10,padding:12,marginBottom:8,borderLeftWidth:3,borderLeftColor:C.accent},
  dealItemName:{color:C.text,fontSize:14,fontWeight:'600'},
  dealItemPrice:{color:C.accent,fontSize:13,fontWeight:'700',marginTop:2},
  routeBtn:{backgroundColor:C.accent,borderRadius:12,padding:14,alignItems:'center',marginTop:8},
  routeBtnText:{color:'#fff',fontSize:15,fontWeight:'700'},
});
```

---

## screens/Profile.js

```javascript
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const C = { bg:'#0d0d0f', surface:'#16161a', surface2:'#1e1e24', border:'#2a2a35', accent:'#ff5c35', accent2:'#ffb800', text:'#f0f0f0', muted:'#888899', green:'#2ecc71' };

const TOP_SHOPPERS = [
  { name:'Sandra_Deals ⭐', sub:'128 Deals · Wien · Lebensmittel', color:'#ff5c35', following:false },
  { name:'MaxTechDeals ⭐', sub:'203 Deals · Wien · Tech & Gadgets', color:'#4a9eff', following:false },
  { name:'LisaShops ⭐', sub:'91 Deals · Wien · Mode & Lifestyle', color:'#2ecc71', following:true },
  { name:'KarlMystery ⭐', sub:'77 Deals · Wien · Mystery Boxes', color:'#ffb800', following:false },
];

export default function ProfileScreen() {
  const [following, setFollowing] = useState(TOP_SHOPPERS.map(s => s.following));

  return (
    <SafeAreaView style={{flex:1, backgroundColor:C.bg}}>
      <ScrollView contentContainerStyle={{paddingBottom:100}}>
        <View style={s.header}>
          <View style={s.avatar}><Text style={s.avatarText}>N</Text></View>
          <Text style={s.name}>Nico</Text>
          <Text style={s.handle}>@nico_deals</Text>
          <View style={s.vsBadge}><Text style={s.vsBadgeText}>⭐ VielShopper</Text></View>
        </View>

        <View style={s.statsRow}>
          {[['47','Deals gepostet'],['312','Follower'],['89','Folge ich']].map(([n,l],i) => (
            <View key={i} style={[s.statItem, i<2 && {borderRightWidth:1, borderRightColor:C.border}]}>
              <Text style={s.statNum}>{n}</Text>
              <Text style={s.statLabel}>{l}</Text>
            </View>
          ))}
        </View>

        <Text style={s.sectionTitle}>TOP VIELSHOPPER FOLGEN</Text>
        <View style={{paddingHorizontal:16, gap:10}}>
          {TOP_SHOPPERS.map((sh,i) => (
            <View key={i} style={s.shopperItem}>
              <View style={[s.shopperAv, {backgroundColor: sh.color+'33'}]}>
                <Text style={[s.shopperAvText, {color:sh.color}]}>{sh.name[0]}</Text>
              </View>
              <View style={{flex:1}}>
                <Text style={s.shopperName}>{sh.name}</Text>
                <Text style={s.shopperSub}>{sh.sub}</Text>
              </View>
              <TouchableOpacity
                style={[s.followBtn, following[i] && s.followBtnActive]}
                onPress={() => { const f=[...following]; f[i]=!f[i]; setFollowing(f); }}
              >
                <Text style={[s.followBtnText, following[i] && {color:'#fff'}]}>
                  {following[i] ? 'Folge ich ✓' : 'Folgen'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={s.sectionTitle}>MEINE LETZTEN DEALS</Text>
        <View style={{paddingHorizontal:16, gap:8}}>
          {[
            {icon:'🎲', title:'Ravensburger Mystery Box entdeckt!', meta:'vor 2 Stunden · 24 Likes · 8 Kommentare'},
            {icon:'📱', title:'Samsung Galaxy S25 −30% bei Saturn', meta:'vor 1 Tag · 61 Likes · 14 Kommentare'},
          ].map((d,i) => (
            <View key={i} style={s.recentDeal}>
              <Text style={{fontSize:22}}>{d.icon}</Text>
              <View style={{flex:1}}>
                <Text style={s.recentTitle}>{d.title}</Text>
                <Text style={s.recentMeta}>{d.meta}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header:{alignItems:'center', padding:24, paddingBottom:16},
  avatar:{width:72,height:72,borderRadius:36,backgroundColor:'#ff5c35',alignItems:'center',justifyContent:'center',marginBottom:12},
  avatarText:{color:'#fff',fontSize:28,fontWeight:'800'},
  name:{color:C.text,fontSize:22,fontWeight:'700'},
  handle:{color:C.muted,fontSize:14,marginTop:2},
  vsBadge:{backgroundColor:C.accent2+'22',borderWidth:1,borderColor:C.accent2+'55',borderRadius:20,paddingHorizontal:14,paddingVertical:5,marginTop:10},
  vsBadgeText:{color:C.accent2,fontSize:13,fontWeight:'700'},
  statsRow:{flexDirection:'row',marginHorizontal:16,backgroundColor:C.surface,borderRadius:16,borderWidth:1,borderColor:C.border,marginBottom:24},
  statItem:{flex:1,alignItems:'center',paddingVertical:14},
  statNum:{color:C.accent,fontSize:22,fontWeight:'800'},
  statLabel:{color:C.muted,fontSize:11,marginTop:2},
  sectionTitle:{color:C.muted,fontSize:11,fontWeight:'700',letterSpacing:1,paddingHorizontal:16,marginBottom:12,marginTop:16},
  shopperItem:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:C.surface,borderRadius:12,padding:12,borderWidth:1,borderColor:C.border},
  shopperAv:{width:38,height:38,borderRadius:19,alignItems:'center',justifyContent:'center'},
  shopperAvText:{fontSize:15,fontWeight:'700'},
  shopperName:{color:C.text,fontSize:14,fontWeight:'600'},
  shopperSub:{color:C.muted,fontSize:12,marginTop:1},
  followBtn:{backgroundColor:C.surface2,borderWidth:1.5,borderColor:C.border,borderRadius:20,paddingHorizontal:14,paddingVertical:6},
  followBtnActive:{backgroundColor:C.accent,borderColor:C.accent},
  followBtnText:{color:C.text,fontSize:13,fontWeight:'600'},
  recentDeal:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:C.surface,borderRadius:12,padding:12,borderWidth:1,borderColor:C.border},
  recentTitle:{color:C.text,fontSize:14,fontWeight:'600'},
  recentMeta:{color:C.muted,fontSize:12,marginTop:2},
});
```

---

## screens/Post.js

```javascript
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';

const C = { bg:'#0d0d0f', surface:'#16161a', surface2:'#1e1e24', border:'#2a2a35', accent:'#ff5c35', text:'#f0f0f0', muted:'#888899' };

const CATS = ['Food','Tech','Mode','Spielzeug','Drogerie','Sport'];
const BADGES = ['🔥 Deal','🎁 Mystery Box','✨ Neu','🏷️ Sale'];

export default function PostScreen() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [cat, setCat] = useState(0);
  const [badge, setBadge] = useState(0);

  return (
    <SafeAreaView style={{flex:1, backgroundColor:C.bg}}>
      <ScrollView contentContainerStyle={{padding:16, paddingBottom:100}}>
        <Text style={s.title}>Deal posten ✍️</Text>

        <Text style={s.label}>Titel *</Text>
        <TextInput style={s.input} placeholder="z.B. Samsung Galaxy S25 −30%" placeholderTextColor={C.muted} value={title} onChangeText={setTitle} />

        <Text style={s.label}>Beschreibung</Text>
        <TextInput style={[s.input, {height:80, textAlignVertical:'top'}]} placeholder="Was macht diesen Deal besonders?" placeholderTextColor={C.muted} value={desc} onChangeText={setDesc} multiline />

        <View style={{flexDirection:'row', gap:12}}>
          <View style={{flex:1}}>
            <Text style={s.label}>Neuer Preis</Text>
            <TextInput style={s.input} placeholder="€0,00" placeholderTextColor={C.muted} value={price} onChangeText={setPrice} />
          </View>
          <View style={{flex:1}}>
            <Text style={s.label}>Alter Preis</Text>
            <TextInput style={s.input} placeholder="€0,00" placeholderTextColor={C.muted} value={oldPrice} onChangeText={setOldPrice} />
          </View>
        </View>

        <Text style={s.label}>Kategorie</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8, marginBottom:16}}>
          {CATS.map((c,i) => (
            <TouchableOpacity key={i} style={[s.chip, cat===i && s.chipActive]} onPress={() => setCat(i)}>
              <Text style={[s.chipText, {color: cat===i ? C.accent : C.muted}]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={s.label}>Badge</Text>
        <View style={{flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:24}}>
          {BADGES.map((b,i) => (
            <TouchableOpacity key={i} style={[s.chip, badge===i && s.chipActive]} onPress={() => setBadge(i)}>
              <Text style={[s.chipText, {color: badge===i ? C.accent : C.muted}]}>{b}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.label}>Shop suchen</Text>
        <TextInput style={s.input} placeholder="z.B. Saturn, Billa, Zara..." placeholderTextColor={C.muted} />

        <TouchableOpacity
          style={s.submitBtn}
          onPress={() => Alert.alert('✅ Deal gepostet!', 'Dein Deal ist jetzt im Feed sichtbar.')}
        >
          <Text style={s.submitText}>Deal jetzt posten 🔥</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  title:{color:C.text,fontSize:22,fontWeight:'700',marginBottom:20},
  label:{color:C.muted,fontSize:12,fontWeight:'600',letterSpacing:0.5,marginBottom:6},
  input:{backgroundColor:C.surface,borderRadius:12,borderWidth:1,borderColor:C.border,padding:12,color:C.text,fontSize:14,marginBottom:16},
  chip:{paddingHorizontal:14,paddingVertical:7,borderRadius:20,borderWidth:1.5,borderColor:C.border,backgroundColor:C.surface},
  chipActive:{borderColor:C.accent,backgroundColor:C.accent+'1A'},
  chipText:{fontSize:13,fontWeight:'500'},
  submitBtn:{backgroundColor:C.accent,borderRadius:14,padding:16,alignItems:'center',marginTop:8},
  submitText:{color:'#fff',fontSize:16,fontWeight:'700'},
});
```
