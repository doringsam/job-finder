"use client";

import { useMemo, useState } from "react";

type Region = "충청권 전체" | "대전" | "세종" | "충남" | "충북";
type Job = {
  id: number;
  title: string;
  field: string;
  type: "인턴" | "신입";
  location: string;
  region: Exclude<Region, "충청권 전체"> | "서울";
  studentEligible: boolean;
  bioHealthData: boolean;
  note: string;
};

const jobs: Job[] = [
  { id: 1, title: "유전체 데이터 분석 인턴", field: "바이오·헬스케어 데이터 분석", type: "인턴", location: "대전 유성구", region: "대전", studentEligible: true, bioHealthData: true, note: "유전체 데이터 정리 및 분석 보조" },
  { id: 2, title: "임상 데이터 큐레이션 인턴", field: "바이오·헬스케어 데이터 분석", type: "인턴", location: "세종 조치원", region: "세종", studentEligible: true, bioHealthData: true, note: "임상 데이터 검수 및 표준화" },
  { id: 3, title: "디지털 헬스 데이터 운영 인턴", field: "바이오·헬스케어 데이터 분석", type: "인턴", location: "충남 천안", region: "충남", studentEligible: true, bioHealthData: true, note: "헬스케어 데이터 품질 확인" },
  { id: 4, title: "바이오마커 데이터 리서치 인턴", field: "바이오·헬스케어 데이터 분석", type: "인턴", location: "충북 청주", region: "충북", studentEligible: true, bioHealthData: true, note: "바이오마커 자료 조사 및 데이터 정리" },
  { id: 5, title: "의생명 연구 데이터 보조 인턴", field: "의생명 연구지원", type: "인턴", location: "대전 중구", region: "대전", studentEligible: true, bioHealthData: false, note: "연구 데이터 입력 및 결과 정리" },
  { id: 6, title: "단백질 연구 운영 인턴", field: "생명과학 연구지원", type: "인턴", location: "세종 집현동", region: "세종", studentEligible: true, bioHealthData: false, note: "연구 기록 및 시료 정보 관리" },
  { id: 7, title: "바이오인포매틱스 분석가", field: "바이오·헬스케어 데이터 분석", type: "신입", location: "대전 유성구", region: "대전", studentEligible: true, bioHealthData: true, note: "바이오 데이터 분석 및 보고서 작성" },
  { id: 8, title: "헬스케어 데이터 인턴", field: "바이오·헬스케어 데이터 분석", type: "인턴", location: "서울 강남구", region: "서울", studentEligible: true, bioHealthData: true, note: "건강 데이터 분석 보조" },
  { id: 9, title: "유전체 분석 장기 인턴", field: "바이오·헬스케어 데이터 분석", type: "인턴", location: "대전 유성구", region: "대전", studentEligible: false, bioHealthData: true, note: "졸업예정자만 지원 가능" },
];

const regionOptions: Region[] = ["충청권 전체", "대전", "세종", "충남", "충북"];

function JobCard({ job, onSimilar }:{ job:Job; onSimilar:(type:Job["type"])=>void }) {
  return <article className="job-card">
    <div className="eligibility-badge"><span>✓</span> 재학생 지원 가능</div>
    <div className="job-index">공고 {String(job.id).padStart(2,"0")}</div>
    <h3>{job.title}</h3>
    <p className="job-field">{job.field}</p>
    <p className="job-note">{job.note}</p>
    <dl>
      <div><dt>채용 형태</dt><dd>{job.type}</dd></div>
      <div><dt>근무지</dt><dd>{job.location}</dd></div>
    </dl>
    <button className="similar-button" onClick={()=>onSimilar(job.type)}>같은 채용 형태의 비슷한 공고 <span>→</span></button>
  </article>;
}

export default function Home() {
  const [bioOnly,setBioOnly]=useState(false);
  const [region,setRegion]=useState<Region>("충청권 전체");
  const [studentOnly,setStudentOnly]=useState(true);
  const [jobType,setJobType]=useState<Job["type"]>("인턴");
  const [conditionOpen,setConditionOpen]=useState(false);
  const [similarType,setSimilarType]=useState<Job["type"]|null>(null);
  const [notice,setNotice]=useState("");

  const recommendedJobs=useMemo(()=>jobs
    .filter(job=>!studentOnly||job.studentEligible)
    .filter(job=>job.type===jobType)
    .filter(job=>region==="충청권 전체"?["대전","세종","충남","충북"].includes(job.region):job.region===region)
    .filter(job=>!bioOnly||job.bioHealthData)
    .filter(job=>!similarType||job.type===similarType)
    .sort((a,b)=>Number(b.bioHealthData)-Number(a.bioHealthData)),[bioOnly,region,studentOnly,jobType,similarType]);

  const showNotice=(message:string)=>{setNotice(message);window.setTimeout(()=>setNotice(""),2400)};
  const applyConditions=()=>{setConditionOpen(false);setSimilarType(null);showNotice("선택한 조건으로 공고를 다시 정리했어요.")};
  const showSimilar=(type:Job["type"])=>{setSimilarType(type);setJobType(type);showNotice(`${type} 공고만 모아 보여드려요.`);document.getElementById("results")?.scrollIntoView({behavior:"smooth"})};

  return <main>
    <header className="site-header">
      <a className="brand" href="#top" aria-label="캠퍼스픽 홈"><span>campus</span>pick<i>●</i></a>
      <div className="student-context"><span>CNU</span><p>충남대학교<br/><strong>생명정보학과 3학년</strong></p></div>
      <button className="condition-header" onClick={()=>setConditionOpen(true)}>조건 변경 <span>↗</span></button>
    </header>

    <section className="intro" id="top">
      <div className="intro-copy">
        <p className="eyebrow">PERSONAL JOB FINDER · 01</p>
        <h1>지원할 공고만,<br/><em>먼저 보이게.</em></h1>
        <p>재학생이 지원할 수 있는 충청권 인턴을 모으고,<br/>바이오·헬스케어 데이터 분석 직무를 위로 올렸어요.</p>
      </div>
      <aside className="rule-card" aria-label="현재 추천 기준">
        <div className="rule-card-head"><span>현재 추천 기준</span><b>3</b></div>
        <ol><li><span>01</span><p>재학생 지원 가능</p><b>필수</b></li><li><span>02</span><p>인턴 · 충청권</p><b>필수</b></li><li><span>03</span><p>바이오·헬스케어 데이터 분석</p><b>우선</b></li></ol>
      </aside>
      <div className="decor-circle one"/><div className="decor-circle two"/>
    </section>

    <section className="finder" id="results">
      <div className="finder-top">
        <div><p className="section-label">MATCHED OPPORTUNITIES</p><h2>{similarType?`같은 ${similarType} 공고`:`추천 공고 ${recommendedJobs.length}개`}</h2><p>{similarType?"채용 형태가 같은 공고를 모았어요.":"공고 데이터만 기준으로 추천 순서를 정했어요."}</p></div>
        <button className="change-button" onClick={()=>setConditionOpen(true)}><span>＋</span> 조건 변경</button>
      </div>

      <div className="quick-filters" aria-label="빠른 필터">
        <button className={bioOnly?"active":""} onClick={()=>{setBioOnly(true);setSimilarType(null)}}><span>01</span> 바이오·헬스케어 데이터 분석 {bioOnly&&<b>✓</b>}</button>
        <button className={jobType==="인턴"&&region==="충청권 전체"?"active":""} onClick={()=>{setJobType("인턴");setRegion("충청권 전체");setSimilarType(null)}}><span>02</span> 인턴·충청권 <b>✓</b></button>
        <button className={studentOnly?"active":""} onClick={()=>{setStudentOnly(true);setSimilarType(null)}}><span>03</span> 재학생 지원 가능 <b>✓</b></button>
      </div>

      <div className="result-summary">
        <p><strong>{region}</strong> · {jobType} · 재학생 지원 가능</p>
        {bioOnly&&<button onClick={()=>setBioOnly(false)}>바이오 분야 필터 해제 ×</button>}
        {similarType&&<button onClick={()=>setSimilarType(null)}>비슷한 공고 보기 종료 ×</button>}
      </div>

      {recommendedJobs.length?<div className="job-grid">{recommendedJobs.map(job=><JobCard key={job.id} job={job} onSimilar={showSimilar}/>)}</div>:<div className="empty-state"><span>0</span><h3>선택한 조건에 맞는 공고가 없어요.</h3><button onClick={()=>setConditionOpen(true)}>조건 다시 선택</button></div>}
      <p className="sample-note">현재 화면의 공고는 기능 확인을 위한 샘플 데이터입니다.</p>
    </section>

    <footer><a className="brand" href="#top"><span>campus</span>pick<i>●</i></a><p>충남대 생명정보학과 3학년을 위한 공고 파인더</p><small>API 연결 없이 샘플 공고로 동작합니다.</small></footer>

    {conditionOpen&&<div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setConditionOpen(false)}}>
      <section className="condition-panel" role="dialog" aria-modal="true" aria-labelledby="condition-title">
        <div className="panel-head"><div><p>FILTER SETTINGS</p><h2 id="condition-title">조건 변경</h2></div><button onClick={()=>setConditionOpen(false)} aria-label="닫기">×</button></div>
        <p className="panel-intro">지역·채용 형태·지원 자격을 다시 선택할 수 있어요.</p>
        <label>근무 지역</label><div className="region-options">{regionOptions.map(item=><button key={item} className={region===item?"selected":""} onClick={()=>setRegion(item)}>{item}</button>)}</div>
        <label htmlFor="job-type">채용 형태</label><select id="job-type" value={jobType} onChange={e=>setJobType(e.target.value as Job["type"])}><option value="인턴">인턴</option></select><p className="field-help">이번 추천에서는 인턴 공고만 다룹니다.</p>
        <label htmlFor="eligibility">지원 자격</label><select id="eligibility" value={studentOnly?"eligible":""} onChange={()=>setStudentOnly(true)}><option value="eligible">재학생 지원 가능</option></select>
        <button className="apply-button" onClick={applyConditions}>이 조건으로 공고 보기 <span>→</span></button>
      </section>
    </div>}
    {notice&&<div className="toast" role="status">✓ {notice}</div>}
  </main>;
}
