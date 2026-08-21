"use client";

import { useMemo, useState } from "react";
import recruitmentJobs from "../jobs.json";

type Region = "충청권 전체" | "대전" | "세종" | "충남" | "충북";
type JobRegion = Exclude<Region, "충청권 전체"> | "서울" | "";
type Job = {
  id: number;
  title: string;
  field: string;
  type: "인턴" | "신입";
  location: string;
  regions: JobRegion[];
  studentEligible: boolean | null;
  bioHealthData: boolean;
  note: string;
};

type RecruitmentJob = {
  recrutPblntSn: number;
  recrutPbancTtl?: string | null;
  ncsCdNmLst?: string | null;
  hireTypeNmLst?: string | null;
  workRgnNmLst?: string | null;
  recrutSeNm?: string | null;
  instNm?: string | null;
};

const regionOptions: Region[] = ["충청권 전체", "대전", "세종", "충남", "충북"];

const jobs: Job[] = (recruitmentJobs as RecruitmentJob[]).map((rawJob) => {
  const title = rawJob.recrutPbancTtl ?? "";
  const field = rawJob.ncsCdNmLst ?? "";
  const note = rawJob.instNm ?? "";
  const location = rawJob.workRgnNmLst ?? "";
  const searchableText = `${title} ${field} ${note}`;
  const hasBioHealthTerms = /바이오|생명|유전체|의료|헬스|보건|임상|의약|제약/.test(searchableText);
  const hasDataTerms = /데이터|분석|정보|전산|통계|AI|인공지능/.test(searchableText);

  return {
    id: rawJob.recrutPblntSn,
    title,
    field,
    type: rawJob.hireTypeNmLst?.includes("인턴") ? "인턴" : "신입",
    location,
    regions: (["대전", "세종", "충남", "충북", "서울"] as const).filter((item) => location.includes(item)),
    studentEligible: null,
    bioHealthData: hasBioHealthTerms && hasDataTerms,
    note,
  };
});

function JobCard({ job, onSimilar }:{ job:Job; onSimilar:(type:Job["type"])=>void }) {
  return <article className="job-card">
    <div className="eligibility-badge">{job.studentEligible === true && <><span>✓</span> 재학생 지원 가능</>}</div>
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
  const [studentOnly,setStudentOnly]=useState(false);
  const [jobType,setJobType]=useState<Job["type"]>("인턴");
  const [conditionOpen,setConditionOpen]=useState(false);
  const [similarType,setSimilarType]=useState<Job["type"]|null>(null);
  const [notice,setNotice]=useState("");

  const recommendedJobs=useMemo(()=>jobs
    .filter(job=>!studentOnly||job.studentEligible===true)
    .filter(job=>job.type===jobType)
    .filter(job=>region==="충청권 전체"?job.regions.some(item=>["대전","세종","충남","충북"].includes(item)):job.regions.includes(region))
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
        <p><strong>{region}</strong> · {jobType}{studentOnly?" · 재학생 지원 가능":""}</p>
        {bioOnly&&<button onClick={()=>setBioOnly(false)}>바이오 분야 필터 해제 ×</button>}
        {similarType&&<button onClick={()=>setSimilarType(null)}>비슷한 공고 보기 종료 ×</button>}
      </div>

      {recommendedJobs.length?<div className="job-grid">{recommendedJobs.map(job=><JobCard key={job.id} job={job} onSimilar={showSimilar}/>)}</div>:<div className="empty-state"><span>0</span><h3>선택한 조건에 맞는 공고가 없어요.</h3><button onClick={()=>setConditionOpen(true)}>조건 다시 선택</button></div>}
      <p className="sample-note">공공데이터포털의 진행 중인 채용 공고를 표시합니다.</p>
    </section>

    <footer><a className="brand" href="#top"><span>campus</span>pick<i>●</i></a><p>충남대 생명정보학과 3학년을 위한 공고 파인더</p><small>공공데이터포털 채용 공고를 기준으로 동작합니다.</small></footer>

    {conditionOpen&&<div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setConditionOpen(false)}}>
      <section className="condition-panel" role="dialog" aria-modal="true" aria-labelledby="condition-title">
        <div className="panel-head"><div><p>FILTER SETTINGS</p><h2 id="condition-title">조건 변경</h2></div><button onClick={()=>setConditionOpen(false)} aria-label="닫기">×</button></div>
        <p className="panel-intro">지역·채용 형태·지원 자격을 다시 선택할 수 있어요.</p>
        <label>근무 지역</label><div className="region-options">{regionOptions.map(item=><button key={item} className={region===item?"selected":""} onClick={()=>setRegion(item)}>{item}</button>)}</div>
        <label htmlFor="job-type">채용 형태</label><select id="job-type" value={jobType} onChange={e=>setJobType(e.target.value as Job["type"])}><option value="인턴">인턴</option></select><p className="field-help">이번 추천에서는 인턴 공고만 다룹니다.</p>
        <label htmlFor="eligibility">지원 자격</label><select id="eligibility" value={studentOnly?"eligible":""} onChange={e=>setStudentOnly(e.target.value==="eligible")}><option value="">전체</option><option value="eligible">재학생 지원 가능</option></select>
        <button className="apply-button" onClick={applyConditions}>이 조건으로 공고 보기 <span>→</span></button>
      </section>
    </div>}
    {notice&&<div className="toast" role="status">✓ {notice}</div>}
  </main>;
}
