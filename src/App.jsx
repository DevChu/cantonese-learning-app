import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Music, 
  PlusCircle, 
  Home, 
  Settings, 
  Mic, 
  Play, 
  Trash2, 
  Upload,
  Star,
  ChevronRight,
  X,
  Download,
  RefreshCw,
  Languages,
  Edit3
} from 'lucide-react';

// --- 字典與預設資料 ---

// 常用普通話(書面語) -> 粵語(口語) 對照表
const MANDARIN_TO_CANTONESE = {
  '你好': '你好',
  '早安': '早晨',
  '早上好': '早晨',
  '午安': '午安',
  '晚安': '早抖',
  '再見': '拜拜',
  '謝謝': '唔該',
  '對不起': '對唔住',
  '不好意思': '唔好意思',
  '沒關係': '唔緊要',
  '多少錢': '幾多錢',
  '這個': '呢個',
  '那個': '嗰個',
  '哪裡': '邊度',
  '這裡': '呢度',
  '那裡': '嗰度',
  '什麼': '乜嘢',
  '誰': '邊個',
  '為什麼': '點解',
  '怎麼': '點樣',
  '是': '係',
  '不是': '唔係',
  '有': '有',
  '沒有': '冇',
  '吃': '食',
  '喝': '飲',
  '喜歡': '鍾意',
  '漂亮': '靚',
  '便宜': '平',
  '貴': '貴',
  '現在': '而家',
  '昨天': '琴日',
  '今天': '今日',
  '明天': '聽日',
  '救命': '救命',
  '警察': '差人',
  '廁所': '廁所',
  '洗手間': '洗手間',
  '麻煩': '唔該',
  '借過': '借借',
  '結帳': '埋單',
  '買單': '埋單',
  '計程車': '的士',
  '公車': '巴士',
  '捷運': '地鐵',
  '地鐵': '地鐵',
  '不知道': '唔知',
  '聽不懂': '聽唔明'
};

// 常用粵語字轉粵拼字典
const SIMPLE_JYUTPING_MAP = {
  '你': 'nei5', '好': 'hou2', '早': 'zou2', '晨': 'san4',
  '食': 'sik6', '咗': 'zo2', '飯': 'faan6', '未': 'mei6', '呀': 'aa3',
  '呢': 'ni1', '個': 'go3', '幾': 'gei2', '多': 'do1', '錢': 'cin2',
  '有': 'jau5', '無': 'mou5', '冇': 'mou5', '平': 'peng4', '啲': 'di1',
  '唔': 'm4', '該': 'goi1', '謝': 'ze6', '客': 'haak3', '氣': 'hei3',
  '對': 'deoi3', '住': 'zyu6', '意': 'ji3', '思': 'si1',
  '拜': 'baai1', '再': 'zoi3', '見': 'gin3',
  '係': 'hai6', '邊': 'bin1', '度': 'dou6', '去': 'heoi3',
  '搭': 'daap3', '車': 'ce1', '地': 'dei6', '鐵': 'tit3',
  '巴': 'baa1', '士': 'si2', '的': 'dik1',
  '埋': 'maai4', '單': 'daan1', '飲': 'jam2', '野': 'je5',
  '我': 'ngo5', '想': 'soeng2', '要': 'jiu3',
  '廁': 'ci3', '所': 'so2', '喺': 'hai2',
  '幫': 'bong1', '手': 'sau2', '救': 'gau3', '命': 'meng6',
  '停': 'ting4', '這': 'ze2', '那': 'naa5',
  '名': 'meng2', '叫': 'giu3', '什': 'sam6', '麼': 'mo1', '乜': 'mat1',
  '開': 'hoi1', '心': 'sam1', '識': 'sik1', '到': 'dou2',
  '聽': 'teng1', '講': 'gong2', '明': 'ming4', '白': 'baak6',
  '慢': 'maan6', '快': 'faai3', '點': 'dim2', '樣': 'joeng2',
  '大': 'daai6', '細': 'sai3', '熱': 'jit6', '凍': 'dung3',
  '味': 'mei6', '難': 'naan4',
  '水': 'seoi2', '茶': 'caa4', '咖': 'gaa3', '啡': 'fei1',
  '知': 'zi1', '緊': 'gan2', '鍾': 'zung1', '靚': 'leng3', '差': 'caai1', '人': 'jan4'
};

const RECOMMENDED_CATEGORIES = [
  '問候', '購物', '餐廳/飲食', '交通', '緊急', '數字/時間', '自我介紹'
];

const INITIAL_CONVERSATIONS = [
  {
    id: 'c1',
    category: '問候',
    items: [
      { id: 'g1', cantonese: '你好', jyutping: 'nei5 hou2', meaning: '你好' },
      { id: 'g2', cantonese: '早晨', jyutping: 'zou2 san4', meaning: '早安' },
      { id: 'g3', cantonese: '食咗飯未呀？', jyutping: 'sik6 zo2 faan6 mei6 aa3?', meaning: '吃過飯了嗎？' },
      { id: 'g4', cantonese: '好耐冇見', jyutping: 'hou2 noi6 mou5 gin3', meaning: '好久不見' },
    ]
  },
  {
    id: 'c2',
    category: '購物',
    items: [
      { id: 's1', cantonese: '呢個幾多錢？', jyutping: 'ni1 go3 gei2 do1 cin2?', meaning: '這個多少錢？' },
      { id: 's2', cantonese: '有無平啲呀？', jyutping: 'jau5 mou5 peng4 di1 aa3?', meaning: '有便宜一點的嗎？' },
      { id: 's3', cantonese: '唔該', jyutping: 'm4 goi1', meaning: '謝謝/勞駕' },
    ]
  }
];

const INITIAL_SONGS = [
  {
    id: 'song1',
    title: 'K歌之王',
    artist: '陳奕迅',
    lyrics: `我唱得不夠動人你別皺眉
我願意和你約定至死
我只想嬉戲唱遊到下世紀
請你別嫌我將這煽情奉獻給你

還能憑甚麼 擁抱若未能令你興奮
便宜地唱出 寫在情歌的性感
還能憑甚麼 要是愛不可感動人
俗套的歌詞 煽動你惻忍

誰人又相信一世一生這膚淺對白
來吧送給你叫幾百萬人流淚過的歌
如從未聽過誓言如幸福摩天輪
才令我因你要呼天叫地
愛愛愛愛那麼多

將我漫天心血一一拋到銀河
誰是垃圾 誰不捨我難過
分一丁目贈我

我唱出心裡話時眼淚會流
要是怕難過抱住我手
我只得千語萬言放在你心
比渴望地老天荒更簡單未算罕有

給你用力作二十首不捨不棄
還附送你愛得過火
給你賣力唱二十首真心真意
米高峰都因我動容
無人及我 你怎麼竟然說
K歌之王 是我

我只想跟你未來浸在愛河
而你那呵欠絕得不能絕
絕到溶掉我`
  }
];

// --- 輔助函數 ---

const generateJyutping = (text) => {
  if (!text) return '';
  return text.split('').map(char => {
    if (SIMPLE_JYUTPING_MAP[char]) return SIMPLE_JYUTPING_MAP[char];
    if (/[a-zA-Z0-9\s]/.test(char)) return char;
    return '';
  }).join(' ').replace(/\s+/g, ' ').trim();
};

// 簡單翻譯功能
const translateToCantonese = (meaning) => {
  if (MANDARIN_TO_CANTONESE[meaning]) {
    return MANDARIN_TO_CANTONESE[meaning];
  }
  let result = meaning;
  Object.keys(MANDARIN_TO_CANTONESE).forEach(key => {
    if (key.length > 1 && result.includes(key)) {
      result = result.replace(new RegExp(key, 'g'), MANDARIN_TO_CANTONESE[key]);
    }
  });
  if (result === meaning) {
      if (meaning.includes('不')) result = result.replace(/不/g, '唔');
      if (meaning.includes('是')) result = result.replace(/是/g, '係');
  }
  return result;
};

// --- 輔助組件 ---

const TabButton = ({ active, icon: Icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full py-2 transition-colors duration-200 ${
      active ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    <Icon size={24} />
    <span className="text-xs mt-1 font-medium">{label}</span>
  </button>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 p-4 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, color = "bg-teal-100 text-teal-800" }) => (
  <span className={`px-2 py-0.5 rounded text-xs font-medium ${color}`}>
    {children}
  </span>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- 獨立視圖組件 ---

const HomeView = ({ savedWords, songs, speak }) => (
  <div className="space-y-6 pb-20">
    <header className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">早晨！</h1>
        <p className="text-slate-500">繼續您的粵語學習之旅</p>
      </div>
      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold">
        粵
      </div>
    </header>

    <div className="grid grid-cols-2 gap-4">
      <Card className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white border-none">
        <div className="text-3xl font-bold mb-1">{savedWords.length}</div>
        <div className="text-teal-100 text-sm">已收藏單字</div>
      </Card>
      <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
        <div className="text-3xl font-bold mb-1">{songs.length}</div>
        <div className="text-indigo-100 text-sm">學習曲目</div>
      </Card>
    </div>

    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
        <Star className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" />
        最近收藏
      </h2>
      {savedWords.length > 0 ? (
        <div className="space-y-2">
          {savedWords.slice(0, 3).map((word, idx) => (
            <Card key={idx} className="flex justify-between items-center">
              <div>
                <div className="font-bold text-lg">{word.cantonese}</div>
                <div className="text-xs text-slate-500">{word.meaning}</div>
              </div>
              <button onClick={() => speak(word.cantonese)} className="p-2 text-teal-600 bg-teal-50 rounded-full">
                <Mic size={16} />
              </button>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border-dashed border-2 border-slate-200">
          還沒有收藏任何單字
        </div>
      )}
    </div>
    
    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
      <h3 className="font-bold text-orange-800 mb-2">每日一句</h3>
      <p className="text-2xl font-serif text-slate-800 mb-1">「世上無難事，只怕有心人」</p>
      <p className="text-sm text-orange-600">Sai soeng mou naan si, zi paa jau sam jan</p>
      <button onClick={() => speak('世上無難事，只怕有心人')} className="mt-2 text-sm text-orange-700 flex items-center gap-1">
        <Play size={14} /> 播放發音
      </button>
    </div>
  </div>
);

const ConversationView = ({ conversations, setConversations, savedWords, toggleSaveWord, speak }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false); 
  const [newCantonese, setNewCantonese] = useState('');
  const [newJyutping, setNewJyutping] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [isCantoneseManuallyEdited, setIsCantoneseManuallyEdited] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleMeaningChange = (e) => {
    setNewMeaning(e.target.value);
  };

  const handleMeaningBlur = () => {
    if (!newMeaning) return;
    if (!newCantonese || !isCantoneseManuallyEdited) {
      const generatedCanto = translateToCantonese(newMeaning);
      setNewCantonese(generatedCanto);
      setNewJyutping(generateJyutping(generatedCanto));
    }
  };

  const handleCantoneseChange = (e) => {
    const text = e.target.value;
    setNewCantonese(text);
    setNewJyutping(generateJyutping(text));
    setIsCantoneseManuallyEdited(true);
  };

  const handleAdd = () => {
    let finalCantonese = newCantonese;
    let finalJyutping = newJyutping;

    if (!finalCantonese && newMeaning) {
      finalCantonese = translateToCantonese(newMeaning);
      finalJyutping = generateJyutping(finalCantonese);
    }

    if (!finalCantonese || !newCategory) {
        alert('請確認已輸入「粵語句子」並選擇了「分類」！');
        return;
    }

    const newItem = {
      id: Date.now().toString(),
      cantonese: finalCantonese,
      jyutping: finalJyutping,
      meaning: newMeaning
    };

    const updatedConversations = [...conversations];
    const categoryIndex = updatedConversations.findIndex(c => c.category === newCategory);

    if (categoryIndex >= 0) {
      updatedConversations[categoryIndex] = {
          ...updatedConversations[categoryIndex],
          items: [...updatedConversations[categoryIndex].items, newItem]
      };
    } else {
      updatedConversations.push({
        id: Date.now().toString() + '_cat',
        category: newCategory,
        items: [newItem]
      });
    }

    setConversations(updatedConversations);
    setIsAdding(false);
    setNewCantonese('');
    setNewJyutping('');
    setNewMeaning('');
    setNewCategory('');
    setIsCustomCategory(false);
    setIsCantoneseManuallyEdited(false); 
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          setConversations([...conversations, ...imported]);
          alert('匯入成功！');
        }
      } catch (err) {
        alert('匯入失敗');
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(conversations, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cantonese_conversations.json";
    link.click();
  };

  const deleteItem = (catId, itemId) => {
    if (!window.confirm("確定要刪除此句嗎？")) return;
    const updated = conversations.map(cat => {
      if (cat.id === catId) {
        return { ...cat, items: cat.items.filter(i => i.id !== itemId) };
      }
      return cat;
    }).filter(cat => cat.items.length > 0);
    setConversations(updated);
  };

  const existingCategories = conversations.map(c => c.category);
  const allCategoriesOption = Array.from(new Set([...existingCategories, ...RECOMMENDED_CATEGORIES]));

  return (
    <div className="space-y-6 pb-20 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">日常對話</h1>
        <div className="flex gap-2">
           <button 
            onClick={() => fileInputRef.current.click()} 
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-full"
            title="匯入 JSON"
          >
            <Upload size={20} />
          </button>
           <button 
            onClick={handleExport} 
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-full"
            title="匯出 JSON"
          >
            <Download size={20} />
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 text-white rounded-full text-sm font-medium hover:bg-teal-700"
          >
            <PlusCircle size={16} /> 新增
          </button>
        </div>
        <input 
            type="file" 
            accept=".json" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleImport}
          />
      </div>

      {conversations.map(cat => (
        <div key={cat.id}>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1 flex justify-between group">
            {cat.category}
          </h3>
          <div className="space-y-3">
            {cat.items.map(item => {
              const isSaved = savedWords.some(w => w.cantonese === item.cantonese);
              return (
                <Card key={item.id} className="relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-xl font-bold text-slate-800">{item.cantonese}</div>
                      <div className="text-sm text-teal-600 font-mono mt-1">{item.jyutping}</div>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => toggleSaveWord(item)}
                        className={`p-1.5 rounded-full ${isSaved ? 'text-yellow-500 bg-yellow-50' : 'text-slate-300 hover:bg-slate-100'}`}
                      >
                        <Star size={20} fill={isSaved ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={() => deleteItem(cat.id, item.id)}
                        className="p-1.5 text-slate-300 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <div className="text-slate-500 text-sm">{item.meaning}</div>
                    <button 
                      onClick={() => speak(item.cantonese)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white text-sm rounded-lg active:scale-95 transition-transform"
                    >
                      <Mic size={14} />
                      發音
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {/* 手動新增 Modal */}
      <Modal isOpen={isAdding} onClose={() => setIsAdding(false)} title="新增對話">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">分類</label>
            {!isCustomCategory ? (
              <select
                className="w-full p-2 border rounded-lg bg-white appearance-none"
                value={newCategory}
                onChange={(e) => {
                  if (e.target.value === 'custom_new') {
                    setIsCustomCategory(true);
                    setNewCategory('');
                  } else {
                    setNewCategory(e.target.value);
                  }
                }}
              >
                <option value="" disabled>請選擇一個分類</option>
                {allCategoriesOption.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="custom_new" className="text-teal-600 font-bold">+ ✏️ 自訂新分類...</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input 
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-teal-500" 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="輸入新分類名稱..."
                  autoFocus
                />
                <button 
                  onClick={() => setIsCustomCategory(false)}
                  className="px-3 py-2 text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  取消
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
              <span>中文意思</span>
              <span className="text-xs text-teal-600 flex items-center gap-1">
                <Languages size={12} />
                輸入完成並離開後自動翻譯
              </span>
            </label>
            <input 
              className="w-full p-2 border rounded-lg" 
              value={newMeaning}
              onChange={handleMeaningChange}
              onBlur={handleMeaningBlur} 
              placeholder="例如：謝謝、對不起..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">粵語句子 (可手動修正)</label>
            <input 
              className="w-full p-2 border rounded-lg bg-slate-50 focus:bg-white transition-colors" 
              value={newCantonese}
              onChange={handleCantoneseChange}
              placeholder="自動生成中..."
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">拼音</label>
              <button 
                onClick={() => setNewJyutping(generateJyutping(newCantonese))}
                className="text-xs text-teal-600 flex items-center gap-1 hover:underline"
              >
                <RefreshCw size={10} /> 重設拼音
              </button>
            </div>
            <input 
              className="w-full p-2 border rounded-lg font-mono text-sm bg-slate-50 focus:bg-white transition-colors" 
              value={newJyutping}
              onChange={(e) => {
                const val = e.target.value;
                if (/^[a-zA-Z0-9\s]*$/.test(val)) {
                  setNewJyutping(val);
                }
              }}
              placeholder="m4 goi1..."
            />
          </div>

          <button 
            onClick={handleAdd}
            className="w-full bg-teal-600 text-white py-2 rounded-lg font-bold mt-2 hover:bg-teal-700 shadow-sm active:scale-95 transition-transform"
          >
            確認新增
          </button>
        </div>
      </Modal>
    </div>
  );
};

const SongView = ({ songs, setSongs, selectedSong, setSelectedSong, toggleSaveWord, speak }) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const title = file.name.replace('.txt', '');
      
      const newSong = {
        id: Date.now().toString(),
        title: title,
        artist: '未知歌手',
        lyrics: text
      };
      
      setSongs([...songs, newSong]);
    };
    reader.readAsText(file);
  };

  const deleteSong = (e, id) => {
    e.stopPropagation();
    if (window.confirm('確定要刪除這首歌嗎？（內建歌曲無法刪除）')) {
      setSongs(songs.filter(s => s.id !== id));
      if (selectedSong?.id === id) setSelectedSong(null);
    }
  };

  if (selectedSong) {
    const lyricsLines = selectedSong.lyrics.split('\n');
    return (
      <div className="pb-20 h-full flex flex-col">
        <button 
          onClick={() => setSelectedSong(null)}
          className="mb-4 flex items-center text-slate-500 hover:text-slate-800 w-fit"
        >
          <ChevronRight className="rotate-180 mr-1" size={20} />
          返回歌單
        </button>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex-1 flex flex-col">
          <div className="bg-indigo-600 p-6 text-white">
            <h2 className="text-2xl font-bold">{selectedSong.title}</h2>
            <p className="text-indigo-200">{selectedSong.artist}</p>
          </div>
          
          <div className="p-6 overflow-y-auto bg-slate-50 flex-1">
            <div className="space-y-6 text-center">
              {lyricsLines.map((line, idx) => (
                line.trim() && (
                  <div key={idx} className="group">
                    <p 
                      className="text-lg text-slate-700 mb-1 cursor-pointer hover:text-indigo-600 transition-colors active:scale-95 transform duration-100"
                      onClick={() => speak(line)}
                    >
                      {line}
                    </p>
                    <button 
                      onClick={(e) => {
                         e.stopPropagation();
                         toggleSaveWord({cantonese: line, meaning: '歌詞', jyutping: '歌詞片段'});
                      }}
                      className="opacity-0 group-hover:opacity-100 text-xs text-slate-400 hover:text-yellow-500 transition-opacity"
                    >
                      收藏此句
                    </button>
                  </div>
                )
              ))}
            </div>
            <div className="text-center text-xs text-slate-400 mt-8 mb-4">
              點擊歌詞可聽發音 (機械音)
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">粵語金曲</h1>
        <button 
          onClick={() => fileInputRef.current.click()}
          className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200"
        >
          <Upload size={20} />
        </button>
        <input 
          type="file" 
          accept=".txt" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
      </div>

      <div className="grid gap-4">
        {songs.map(song => (
          <Card 
            key={song.id} 
            className="flex items-center justify-between cursor-pointer hover:border-indigo-300 transition-colors group"
          >
            <div className="flex items-center gap-4 flex-1" onClick={() => setSelectedSong(song)}>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                <Music size={24} />
              </div>
              <div>
                <div className="font-bold text-slate-800">{song.title}</div>
                <div className="text-sm text-slate-500">{song.artist}</div>
              </div>
            </div>
            {song.id !== 'song1' && (
              <button 
                onClick={(e) => deleteSong(e, song.id)}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            )}
          </Card>
        ))}
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
        <p className="font-bold mb-1">💡 小貼士：</p>
        <p>點擊右上角按鈕上傳 `.txt` 歌詞檔，即可新增更多歌曲。檔案內容只需包含純文字歌詞。</p>
      </div>
    </div>
  );
};

const CustomView = ({ customSentences, setCustomSentences, speak }) => {
  const [inputText, setInputText] = useState('');
  const [inputMeaning, setInputMeaning] = useState('');
  const [inputNote, setInputNote] = useState('');

  const handleAdd = () => {
    if (!inputText.trim()) return;
    const newSentence = {
      id: Date.now(),
      cantonese: inputText,
      meaning: inputMeaning || '自定義句子',
      note: inputNote,
      date: new Date().toLocaleDateString()
    };
    setCustomSentences([newSentence, ...customSentences]);
    setInputText('');
    setInputMeaning('');
    setInputNote('');
  };

  const deleteCustom = (id) => {
    setCustomSentences(customSentences.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-slate-800">自定義學習</h1>
      
      <Card className="bg-slate-50 border-dashed border-2 border-slate-200">
        <div className="space-y-3">
          {/* 意思輸入 */}
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-400 mb-1 block">意思 / 情境</label>
              <input
                type="text"
                placeholder="例如：我想點一杯凍檸茶"
                className="w-full p-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={inputMeaning}
                onChange={(e) => setInputMeaning(e.target.value)}
              />
            </div>
          </div>

          {/* 粵語輸入 */}
          <div>
            <label className="text-xs font-bold text-slate-400 mb-1 block">粵語句子</label>
            <input
              type="text"
              placeholder="輸入粵語..."
              className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          {/* 備註 */}
          <div>
             <label className="text-xs font-bold text-slate-400 mb-1 block">備註 / 筆記</label>
             <input
              type="text"
              placeholder="筆記..."
              className="w-full p-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={inputNote}
              onChange={(e) => setInputNote(e.target.value)}
            />
          </div>
          
          <button 
            onClick={handleAdd}
            className="w-full py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 active:scale-95 transition-transform flex justify-center items-center gap-2"
          >
            <PlusCircle size={18} />
            新增筆記
          </button>
        </div>
      </Card>

      <div className="space-y-3">
        {customSentences.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            還沒有自定義內容，試著加一句《無間道》台詞？
          </div>
        )}
        
        {customSentences.map(item => (
          <Card key={item.id} className="group">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="text-lg font-bold text-slate-800 mb-1">{item.cantonese}</div>
                <div className="text-slate-500 text-sm flex items-center gap-2">
                  <span>{item.meaning}</span>
                  {item.note && (
                    <Badge color="bg-slate-100 text-slate-600">{item.note}</Badge>
                  )}
                </div>
                <div className="text-xs text-slate-300 mt-2">{item.date}</div>
              </div>
              <div className="flex flex-col gap-2">
                 <button 
                  onClick={() => speak(item.cantonese)}
                  className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
                >
                  <Play size={18} />
                </button>
                <button 
                  onClick={() => deleteCustom(item.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- 主應用程式 ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  
  // 核心資料狀態
  const [savedWords, setSavedWords] = useState([]);
  const [customSentences, setCustomSentences] = useState([]);
  const [songs, setSongs] = useState(INITIAL_SONGS);
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  
  // UI 狀態
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null); 
  
  // 載入 LocalStorage
  useEffect(() => {
    const loadData = () => {
      const savedW = localStorage.getItem('cantonese_saved_words');
      const savedS = localStorage.getItem('cantonese_custom_sentences');
      const savedSongs = localStorage.getItem('cantonese_songs');
      const savedConvos = localStorage.getItem('cantonese_conversations');

      if (savedW) setSavedWords(JSON.parse(savedW));
      if (savedS) setCustomSentences(JSON.parse(savedS));
      if (savedSongs) {
        const parsedSongs = JSON.parse(savedSongs);
        const newSongs = parsedSongs.filter(s => s.id !== 'song1');
        setSongs([...INITIAL_SONGS, ...newSongs]);
      }
      if (savedConvos) {
        setConversations(JSON.parse(savedConvos));
      }
    };
    loadData();
  }, []);

  // 儲存監聽
  useEffect(() => {
    localStorage.setItem('cantonese_saved_words', JSON.stringify(savedWords));
  }, [savedWords]);

  useEffect(() => {
    localStorage.setItem('cantonese_custom_sentences', JSON.stringify(customSentences));
  }, [customSentences]);
  
  useEffect(() => {
    localStorage.setItem('cantonese_songs', JSON.stringify(songs));
  }, [songs]);

  useEffect(() => {
    localStorage.setItem('cantonese_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // 語音合成功能
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-HK';
      utterance.rate = 0.9;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert("您的瀏覽器不支援語音合成功能");
    }
  };

  const toggleSaveWord = (item) => {
    const exists = savedWords.find(w => w.cantonese === item.cantonese);
    if (exists) {
      setSavedWords(savedWords.filter(w => w.cantonese !== item.cantonese));
    } else {
      setSavedWords([...savedWords, { ...item, date: new Date().toISOString() }]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-teal-100">
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative overflow-hidden">
        
        <main className="h-screen overflow-y-auto p-5 scrollbar-hide">
          {activeTab === 'home' && (
            <HomeView 
              savedWords={savedWords} 
              songs={songs} 
              speak={speak} 
            />
          )}
          {activeTab === 'conversations' && (
            <ConversationView 
              conversations={conversations}
              setConversations={setConversations}
              savedWords={savedWords}
              toggleSaveWord={toggleSaveWord}
              speak={speak}
            />
          )}
          {activeTab === 'songs' && (
            <SongView 
              songs={songs}
              setSongs={setSongs}
              selectedSong={selectedSong}
              setSelectedSong={setSelectedSong}
              toggleSaveWord={toggleSaveWord}
              speak={speak}
            />
          )}
          {activeTab === 'custom' && (
            <CustomView 
              customSentences={customSentences}
              setCustomSentences={setCustomSentences}
              speak={speak}
            />
          )}
        </main>

        <nav className="absolute bottom-0 left-0 w-full bg-white border-t border-slate-100 px-6 pb-safe pt-2 flex justify-between items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <TabButton 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
            icon={Home} 
            label="首頁" 
          />
          <TabButton 
            active={activeTab === 'conversations'} 
            onClick={() => setActiveTab('conversations')} 
            icon={BookOpen} 
            label="日常" 
          />
          <TabButton 
            active={activeTab === 'songs'} 
            onClick={() => setActiveTab('songs')} 
            icon={Music} 
            label="金曲" 
          />
          <TabButton 
            active={activeTab === 'custom'} 
            onClick={() => setActiveTab('custom')} 
            icon={Settings} 
            label="自訂" 
          />
        </nav>
      </div>
    </div>
  );
}