import json,re,sys,collections
T=[l.rstrip('\n').split('\t') for l in open('/workspace/ui-mockups/ada/data/texts.tsv',encoding='utf-8') if l.count('\t')==3 and not l.startswith('##')]
W=lambda s:set(w.lower() for w in re.findall(r"[A-Za-zÀ-ÿ]{3,}",s))
allow=W(open('/workspace/ui-mockups/docs/UNTRANSLATED.md',encoding='utf-8').read())
en=json.load(open('/tmp/h-en.json'))
enw=set().union(*[W(' '.join(v['strings'])) for v in en.values()])
frw=set().union(*[W(' '.join(v['strings'])) for v in json.load(open('/tmp/h-fr.json')).values()])
col={'de':1,'es':2,'fr':3};tot={};raw={}
NAMES=set('aravind bhaskar chandran devraj gopal iyer keshav madhavan nandan prakash raghuraj ramesh shekhar varma dev ashby venn ekker corral brenner oceana nrm gps'.split())
COG={'de':set('probe online bus auto eta nav temp sensor feed zoom transit scan subsystem index wind teams update software analyst routine national info solar spo mmhg'.split()),
 'es':set('regional silo min resp alt auto eta nav zoom info spo mmhg'.split()),
 'fr':set('silo vent nominal personnel cycle maintenance trace transit press info auto eta nav sys alt spo mmhg'.split())}
SKIP={'gallery'}
for l,c in col.items():
    native=set().union(*[W(r[c]) for r in T]); 
    for r in T:
        if r[0]!=r[c]: native-=W(r[0])-W(r[c])
    d=json.load(open(f'/tmp/h-{l}.json'));hits=collections.defaultdict(set)
    for slug,v in d.items():
        for s in v['strings']:
            s=re.sub(r'\b[a-z]+\.[a-z]+\b|0x[0-9A-Fa-f]+|\b[0-9A-F]{4}\b|PID +MODULE +ADDR +LOAD +ST|:: *[a-z]+|\b(parse|proc|alloc|fork|sched|walk|lock|route|trace)\b\.?(?= +[0-9])','',s) # machine identifiers (UNTRANSLATED.md)
            for w in W(s):
                if w in enw and w not in native and w not in allow:
                    raw[l]=raw.get(l,0)+1
                    if w in NAMES or w in COG[l] or slug in SKIP or (slug=='public-broadcast-channel' and w in frw): continue
                    hits[slug].add((w,s[:70]))
    tot[l]=sum(len(x) for x in hits.values())
    for slug,x in sorted(hits.items()):
        for w,s in sorted(x): print(l,slug,w,'|',s)
print('RAW',raw);print('TOTAL',tot)
