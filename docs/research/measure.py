# Messskript zu docs/research/beratungsdecks.md: PDFs der Decks in dasselbe Verzeichnis legen (Links in beratungsdecks.md), dann python3 measure.py.
# Braucht PyMuPDF (pip install pymupdf). Schreibt measure.json und druckt die Tabelle je Deck.
import pymupdf, glob, re, statistics as st, json, sys
out={}
for f in sorted(glob.glob('*.pdf')):
    d=pymupdf.open(f)
    rows=[]
    for pno,pg in enumerate(d,1):
        W,H=pg.rect.width,pg.rect.height
        scale=540.0/H  # normalise to a 540 pt tall slide (960x540 for 16:9)
        spans=[]
        for b in pg.get_text('dict')['blocks']:
            for l in b.get('lines',[]):
                for s in l['spans']:
                    t=s['text'].strip()
                    if t: spans.append((s['size']*scale, s['bbox'][0]/W, s['bbox'][1]/H, s['bbox'][3]/H, t, s['font']))
        if not spans: rows.append(None); continue
        top=[s for s in spans if s[2]<0.25]
        if not top: rows.append(None); continue
        tsize=max(s[0] for s in top)
        tspans=[s for s in top if abs(s[0]-tsize)<0.6]
        ttext=' '.join(s[4] for s in tspans)
        tlines=len({round(s[2],2) for s in tspans})
        body=[s for s in spans if s[2]>=0.2 and s[0]<tsize-0.6]
        sizes=sorted({round(s[0]) for s in spans})
        src=[s for s in spans if re.match(r'^(sources?|quellen?|note|notes)\b', s[4], re.I)]
        above=[s for s in spans if s[3] <= min(x[2] for x in tspans)+0.005 and s[0]<tsize-0.6]
        words=len(' '.join(s[4] for s in spans).split())
        rows.append(dict(p=pno, tsize=round(tsize,1), tlines=tlines, twords=len(ttext.split()), title=ttext[:110],
            ttop=round(min(s[2] for s in tspans),3), tleft=round(min(s[1] for s in tspans),3),
            fonts=sorted({s[5] for s in spans})[:4], minsize=round(min(s[0] for s in spans),1),
            src=round(src[0][0],1) if src else None, srcy=round(src[0][2],3) if src else None,
            above=[a[4][:30] for a in above][:2], words=words, sizes=sizes))
    out[f]=dict(pages=len(d), w=d[0].rect.width, h=d[0].rect.height, rows=rows)
json.dump(out,open('measure.json','w'),indent=0)
for f,v in out.items():
    R=[r for r in v['rows'] if r]
    ts=[r['tsize'] for r in R]; tw=[r['twords'] for r in R]; wd=[r['words'] for r in R]
    print('%-20s %3dp  title pt med %.0f (%s-%s)  title words med %d  lines med %d  words/slide med %d  min text pt med %.1f  source on %d/%d  source pt %s  fonts %s'%(
        f,v['pages'],st.median(ts),min(ts),max(ts),st.median(tw),st.median([r['tlines'] for r in R]),st.median(wd),st.median([r['minsize'] for r in R]),
        sum(1 for r in R if r['src']),len(R), sorted({r['src'] for r in R if r['src']})[:4], sorted({x for r in R for x in r['fonts']})[:5]))
