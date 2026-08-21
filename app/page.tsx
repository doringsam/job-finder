"use client";

import { useMemo, useState } from "react";

type Job = { id:number; company:string; title:string; location:string; type:"인턴"|"신입"|"계약직"; field:string; majors:string[]; deadline:string; days:number; logo:string; color:string; tags:string[] };

const jobs: Job[] = [
  { id:1, company:"토스", title:"Product Designer Assistant", location:"서울 강남", type:"인턴", field:"디자인", majors:["디자인","전공무관"], deadline:"8월 25일", days:4, logo:"T", color:"#1769ff", tags:["체험형 인턴","포트폴리오","유연근무"] },
  { id:2, company:"당근", title:"Local Business Marketing Intern", location:"서울 서초", type:"인턴", field:"마케팅", majors:["경영·경제","전공무관"], deadline:"8월 27일", days:6, logo:"당", color:"#ff6f0f", tags:["6개월","콘텐츠","식대 지원"] },
  { id:3, company:"무신사", title:"데이터 분석가 (신입)", location:"서울 성동", type:"신입", field:"데이터", majors:["컴퓨터·IT","수학·통계"], deadline:"8월 31일", days:10, logo:"M", color:"#111111", tags:["SQL","Python","신입 공채"] },
  { id:4, company:"오늘의집", title:"콘텐츠 운영 어시스턴트", location:"서울 강남", type:"계약직", field:"콘텐츠", majors:["인문·사회","전공무관"], deadline:"9월 2일", days:12, logo:"집", color:"#35c5f0", tags:["에디팅","커머스","전환 가능"] },
  { id:5, company:"네이버클라우드", title:"AI 서비스 기획 인턴", location:"경기 성남", type:"인턴", field:"기획", majors:["컴퓨터·IT","경영·경제"], deadline:"9월 4일", days:14, logo:"N", color:"#03c75a", tags:["생성형 AI","서비스 기획","3개월"] },
  { id:6, company:"올리브영", title:"글로벌 커머스 MD 신입", location:"서울 용산", type:"신입", field:"마케팅", majors:["경영·경제","어문"], deadline:"9월 7일", days:17, logo:"O", color:"#a3c616", tags:["글로벌","영어","신입 공채"] },
];

const fields = ["전체","기획","마케팅","디자인","개발","데이터","콘텐츠"];

function JobCard({ job, saved, onSave }:{ job:Job; saved:boolean; onSave:()=>void }) {
  return <article className="job-card">
    <div className="job-top"><div className="company-logo" style={{background:job.color}} aria-hidden="true">{job.logo}</div><button className={`save-button ${saved?"saved":""}`} onClick={onSave} aria-label={`${job.title} ${saved?"저장 취소":"저장"}`}>{saved?"♥":"♡"}</button></div>
    <p className="company-name">{job.company}</p><h3>{job.title}</h3><p className="job-meta">{job.location} · {job.type}</p>
    <div className="tag-row">{job.tags.slice(0,2).map(tag=><span key={tag}>{tag}</span>)}</div>
    <div className="job-bottom"><span className={job.days<=7?"urgent":""}>D-{job.days}</span><span>{job.deadline} 마감</span></div>
  </article>;
}

export default function Home() {
  const [field,setField]=useState("전체"); const [keyword,setKeyword]=useState(""); const [major,setMajor]=useState("전공무관"); const [jobType,setJobType]=useState("전체 형태"); const [saved,setSaved]=useState<number[]>([]); const [showSaved,setShowSaved]=useState(false); const [notice,setNotice]=useState("");
  const filteredJobs=useMemo(()=>jobs.filter(job=>{ const query=keyword.trim().toLowerCase(); return (!query||`${job.company} ${job.title} ${job.tags.join(" ")}`.toLowerCase().includes(query))&&(field==="전체"||job.field===field)&&(major==="전공무관"||job.majors.includes(major)||job.majors.includes("전공무관"))&&(jobType==="전체 형태"||job.type===jobType)&&(!showSaved||saved.includes(job.id)); }),[field,keyword,major,jobType,saved,showSaved]);
  const toggleSave=(id:number)=>setSaved(current=>current.includes(id)?current.filter(item=>item!==id):[...current,id]);
  const handleRecommend=()=>{ const count=jobs.filter(job=>(major==="전공무관"||job.majors.includes(major)||job.majors.includes("전공무관"))&&(jobType==="전체 형태"||job.type===jobType)).length; setNotice(`조건에 딱 맞는 공고 ${count}개를 찾았어요.`); window.setTimeout(()=>setNotice(""),2600); document.getElementById("jobs")?.scrollIntoView({behavior:"smooth"}); };

  return <main>
    <header className="site-header"><a className="brand" href="#top" aria-label="캠퍼스픽 홈"><span>campus</span>pick<i>●</i></a><nav aria-label="주요 메뉴"><a className="active" href="#jobs">채용공고</a><a href="#guide">커리어 가이드</a><a href="#companies">기업 탐색</a></nav><div className="header-actions"><button className={`saved-filter ${showSaved?"active":""}`} onClick={()=>setShowSaved(!showSaved)}>♡ 저장 {saved.length}</button><button className="profile-button" aria-label="내 프로필">S</button></div></header>
    <section className="hero" id="top"><div className="hero-copy"><div className="eyebrow"><span>✦</span> 대학생 맞춤 채용 큐레이션</div><h1>첫 커리어,<br/><em>헤매지 않도록.</em></h1><p>전공과 관심 분야만 알려주세요.<br/>나에게 맞는 인턴·신입 공고를 가볍게 골라드려요.</p><div className="social-proof"><div className="avatars"><span>윤</span><span>민</span><span>서</span></div><p><strong>12,480명</strong>의 대학생이<br/>이번 주에 공고를 확인했어요</p></div></div>
      <div className="finder-card"><div className="finder-heading"><span>01</span><div><p>나의 조건</p><h2>어떤 기회를 찾고 있나요?</h2></div></div><label>전공 계열</label><div className="select-wrap"><select value={major} onChange={e=>setMajor(e.target.value)} aria-label="전공 계열"><option>전공무관</option><option>경영·경제</option><option>컴퓨터·IT</option><option>디자인</option><option>인문·사회</option><option>수학·통계</option><option>어문</option></select></div><label>희망 근무 형태</label><div className="type-options">{["전체 형태","인턴","신입"].map(type=><button key={type} className={jobType===type?"selected":""} onClick={()=>setJobType(type)}>{type==="전체 형태"?"상관없음":type}</button>)}</div><button className="recommend-button" onClick={handleRecommend}>내게 맞는 공고 보기 <span>→</span></button><p className="privacy-note">가입 없이 바로 추천받을 수 있어요</p></div><div className="hero-shape shape-one"/><div className="hero-shape shape-two"/>
    </section>
    <section className="jobs-section" id="jobs"><div className="section-head"><div><p className="section-kicker">FOR YOUR NEXT STEP</p><h2>{showSaved?"저장한 공고":"지금 주목할 공고"}</h2><p>{showSaved?"관심 있는 기회를 한곳에 모았어요.":"마감이 가까운 공고부터 살펴보세요."}</p></div><div className="search-box"><span>⌕</span><input value={keyword} onChange={e=>setKeyword(e.target.value)} placeholder="회사, 직무, 키워드 검색" aria-label="채용공고 검색"/></div></div>
      <div className="field-tabs" aria-label="직무 필터">{fields.map(item=><button key={item} className={field===item?"active":""} onClick={()=>setField(item)}>{item}</button>)}</div>
      {filteredJobs.length?<div className="job-grid">{filteredJobs.map(job=><JobCard key={job.id} job={job} saved={saved.includes(job.id)} onSave={()=>toggleSave(job.id)}/>)}</div>:<div className="empty-state"><span>⌕</span><h3>조건에 맞는 공고가 아직 없어요</h3><p>검색어나 필터를 조금 넓혀보세요.</p><button onClick={()=>{setKeyword("");setField("전체");setShowSaved(false)}}>전체 공고 보기</button></div>}
    </section>
    <section className="guide-section" id="guide"><div><p className="section-kicker">CAREER NOTE 03</p><h2>지원 전, 이것만은<br/>챙겨두세요.</h2></div><div className="guide-list"><article><span>01</span><div><h3>경험을 직무 언어로 바꾸기</h3><p>동아리와 팀플도 충분한 경험이에요. 맡은 역할과 만든 변화를 숫자로 정리해 보세요.</p></div><b>↗</b></article><article><span>02</span><div><h3>공고에서 자소서 키워드 찾기</h3><p>자격요건과 주요 업무에 반복되는 단어가 기업이 찾는 핵심 역량이에요.</p></div><b>↗</b></article><article><span>03</span><div><h3>마감 24시간 전 제출하기</h3><p>마감 직전 오류를 피하고, 최종 검토할 여유까지 확보할 수 있어요.</p></div><b>↗</b></article></div></section>
    <section className="company-strip" id="companies"><p>대학생이 가장 많이 찾는 기업</p><div><span>NAVER</span><span>kakao</span><span>LINE</span><span>현대자동차</span><span>CJ</span><span>배달의민족</span></div></section><footer><a className="brand" href="#top"><span>campus</span>pick<i>●</i></a><p>가능성은 이미 충분하니까, 기회만 잘 찾으면 돼요.</p><small>© 2026 Campuspick. Curated for students.</small></footer>{notice&&<div className="toast" role="status">✓ {notice}</div>}
  </main>;
}
