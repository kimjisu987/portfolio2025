fetch('./data/kimjisu.json')
    .then(response => response.json())
    .then(datas => {

        // --------------------------------------------------------------------------------------------------
        // 프로필
        const myName = document.getElementById('myName');
        const profileList = document.getElementById('profileMain');
        const profileShow = datas.profile;
        profileList.innerHTML = '';

        profileShow.forEach(profile => {
            myName.innerHTML = `${profile.nameE}`;
            const profileHTML = `
                <div class="top">
                    <div class="left">
                        <img src="./image/profile.png" alt="프로필 사진">
                    </div>
                    <div class="right">
                        <h2 class="name">${profile.name}</h2>
                        <p class="text">손이 빠른 <span>노력파</span> 퍼블리셔</p>
                    </div>
                </div>
                <ul class="bottom">
                    <li><span><i class="fa-regular fa-user"></i></span>${profile.date}</li>
                    <li><span><i class="fa-regular fa-map"></i></span>${profile.address}</li>
                    <li><span><i class="fa-regular fa-file-lines"></i></span>${profile.mbti}</li>
                    <li><span><i class="fa-regular fa-envelope"></i></span>${profile.email}</li>
                </ul>
                <button type="button" id="notionLink" onclick="window.open('${profile.notion}', '_blank');"><span><i class="fa-solid fa-link"></i></span>Notion</button>
            `;
            profileList.innerHTML += profileHTML;
        });

        // --------------------------------------------------------------------------------------------------
        // 카드 - 프로젝트 수
        const cardList1 = document.getElementById('projectCount');
        const projectCount = datas.project.length;
        cardList1.innerHTML = projectCount;

        // 카드 - 경력 개월수
        const cardList2 = document.getElementById('careerCount');
        let careerCount = 0;

        // position이 "퍼블리셔" 또는 "디자이너"인 데이터만 계산
        datas.experience.forEach(experience => {
            if (experience.position == "퍼블리셔" || experience.position == "디자이너") {
                const startDate = new Date(experience.startdate + "-01"); // "YYYY-MM" 형식을 Date로 변환
                const endDate = experience.enddate ? new Date(experience.enddate + "-01") : new Date(); // 종료일이 없으면 현재 날짜 사용
                const months = ((endDate.getFullYear() - startDate.getFullYear()) * 12) + (endDate.getMonth() - startDate.getMonth());
                careerCount += months; // 누적
            }
        });
        cardList2.innerHTML = careerCount;

        // 카드 - 자격증 수
        const cardList3 = document.getElementById('certiCount');
        const certiCount = datas.certificate.length;
        cardList3.innerHTML = certiCount;

        // --------------------------------------------------------------------------------------------------
        // 프로젝트
        const projectList = document.getElementById('projectMain');
        const projectSort = datas.project.sort((a, b) => b.no - a.no);
        const projectShow = projectSort.slice(0, 6);
        projectList.innerHTML = '';

        projectShow.forEach(project => {
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="./image/${project.img}" alt="${project.name} 이미지">
            `;
            projectList.appendChild(li);
        });

        if (projectShow.length > 0) {
            const firstProject = projectShow[0]; // 첫 번째 데이터
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="./image/${firstProject.img}" alt="${firstProject.name} 이미지">
            `;
            projectList.appendChild(li);
        };

        // 카테고리 버튼 클릭 시 이벤트 처리
        document.querySelectorAll('.projectCate li').forEach(button => {
            button.addEventListener('click', () => {
                const category = button.textContent.trim().toLowerCase();
                filterProjects(category);
                
                document.querySelectorAll('.projectCate li').forEach(btn => btn.classList.remove('cateOn'));
                button.classList.add('cateOn');
            });
        });

        // 프로젝트 필터링 함수
        function filterProjects(category) {
            const projectCon = document.getElementById('projectCon');
            projectCon.innerHTML = ''; // 기존 프로젝트 리스트 비우기
        
            const projectCate = category === 'all' 
                ? datas.project.sort((a, b) => b.no - a.no)
                : datas.project.filter(project => project.cate.toLowerCase() === category).sort((a, b) => b.no - a.no);
            
            projectCate.forEach(project => {
                const li = document.createElement('li');
                const positionHtml = Array.isArray(project.position)
                    ? project.position.map(pos => `<p class="tag">${pos}</p>`).join('')  // 배열일 경우
                    : `<p class="tag">${project.position}</p>`;  // 문자열일 경우
        
                li.innerHTML = `
                    <div class="imgWrap">
                        <img src="./image/${project.img}" alt="${project.name} 이미지">
                        ${positionHtml}
                    </div>
                    <div class="detailWrap">
                        <p class="title">${project.name}</p>
                        <p class="date">${project.startdate} ~ ${project.enddate}</p>
                        <p class="percent">기여도 <span class="number">${project.contribution}<span></p>
                    </div>
                    <div class="btnBox">
                        <a href="${project.notion}" class="notionBtn" target="_blank">정리노트</a>
                        <a href="${project.website}" target="_blank">웹사이트</a>
                    </div>
                `;
                projectCon.appendChild(li);
            });
        }
    
        // 초기 로딩 시 전체 프로젝트를 보여줌
        filterProjects('all');

        // --------------------------------------------------------------------------------------------------
        // 경력
        const careerList = document.getElementById('careerMain');
        const careerCon = document.getElementById('careerCon');
        const timeline = document.getElementById('timeline');
        const careerSort = datas.experience.sort((a, b) => b.no - a.no);
        const careerShow = careerSort.slice(0, 8);
        const careerShow5 = careerSort.slice(0, 5);
        careerList.innerHTML = '';
        careerCon.innerHTML = '';
        timeline.innerHTML = '';

        careerShow.forEach(career => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="left"><img src="./image/${career.logo}" alt="${career.company} 로고"></div>
                <div class="center">
                    <p class="company">${career.company}${career.relation == "1" ? `<span class="state">재직중</span>` : ''}</p>
                    <p class="date">${career.startdate} ~ ${career.enddate || '재직중'}</p>
                </div>
                <div class="right">${career.position}</div>
            `;
            careerList.appendChild(li);
        });

        careerSort.forEach(career => {
            const li = document.createElement('li');
            // 경력 시작일과 종료일을 날짜 형식으로 변환
            const startDate = new Date(career.startdate);
            const endDate = career.enddate ? new Date(career.enddate) : new Date();  // 종료일이 없는 경우 현재 날짜 - 재직중

            // 월 차이 계산 (재직 중인 경우 끝날 때까지의 차이)
            let months = ((endDate.getFullYear() - startDate.getFullYear()) * 12) + endDate.getMonth() - startDate.getMonth();

            // 년, 월로 분리
            const years = Math.floor(months / 12);
            const Month = months % 12 + 1;

            // 경력 기간을 '1년 1개월' 형식으로 표시
            const careerDuration = `${years > 0 ? years + '년' : ''} ${Month > 0 ? Month + '개월' : ''}`.trim();
            li.innerHTML = `
                <div class="img">
                    <img src="./image/${career.logo}" alt="${career.company} 로고">
                    ${career.relation == "1" ? `<p class="state">재직중</p>` : ''}
                </div>
                <div class="text">
                    <div class="textTop">
                        <p class="company">${career.company}</p>
                        <p class="position">${career.position}</p>
                    </div>
                    <div class="textBottom">
                        ${career.startdate} ~ ${career.enddate || '재직중'}
                        <span>(${careerDuration})</span>
                    </div>
                </div>
            `;
            careerCon.appendChild(li);
        });

        careerShow5.forEach(career => {
            const li = document.createElement('li');
            const startYear = career.startdate ? career.startdate.slice(0, 4) : "N/A";
            const endYear = career.enddate ? career.enddate.slice(0, 4) : "현재";
            li.innerHTML = `
                <p class="date">${startYear} ~ ${endYear}</p>
                <p class="name">${career.company}</p>
            `;
            timeline.appendChild(li);
        });

        // --------------------------------------------------------------------------------------------------
        // 스킬
        const skillList = document.getElementById('skillMain');
        const skillCon = document.getElementById('skillCon');
        const skillSort = datas.skill;
        const skillShow = skillSort.slice(0, 6);
        skillList.innerHTML = '';
        skillCon.innerHTML = '';

        skillShow.forEach(skill => {
            const li = document.createElement('li');
            li.innerHTML = `
                <p class="title">${skill.name}</p>
                <p class="percent">${skill.level}%</p>
                <div class="progress">
                    <p>&nbsp;</p>
                    <p style="width: ${skill.level}%;">&nbsp;</p>
                </div>
            `;
            skillList.appendChild(li);
        });

        skillSort.forEach(skill => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="piecontainer"> 
                    <div class="piechart" style="background-image: conic-gradient(var(--pointColor) calc(365 * 0.${skill.level}deg) , transparent 0)"></div>
                    <div class="piecover">&nbsp;</div>
                    <div class="skillName">
                        <p class="level">${skill.level}%</p>
                        <p>${skill.name}</p>
                    </div>
                </div>
            `;
            skillCon.appendChild(li);
        });

        // --------------------------------------------------------------------------------------------------
        // 자격증
        const certiList = document.getElementById('certiMain');
        const certiSort = datas.certificate.sort((a, b) => b.no - a.no);
        const certiShow = certiSort.slice(0, 8);
        certiList.innerHTML = '';

        certiShow.forEach(certi => {
            const li = document.createElement('li');
            li.innerHTML = `
                <p><i class="fa-solid ${certi.cate == "design" ? `fa-palette` : certi.cate == "OA" ? `fa-file-lines` : certi.catedetail == "eco" ? `fa-comments-dollar` : certi.catedetail == "car" ? "fa-car" : ""}"></i></p>
                <div class="right">
                    <p class="name">${certi.name}</p>
                    <p class="date">${certi.date}</p>
                </div>
            `;
            certiList.appendChild(li);
        });

        // 카테고리 버튼 클릭 시 이벤트 처리
        document.querySelectorAll('.certiCate li').forEach(button => {
            button.addEventListener('click', () => {
                const cate = button.textContent.trim().toLowerCase();
                filterCertis(cate);
                
                document.querySelectorAll('.certiCate li').forEach(btn => btn.classList.remove('cateOn'));
                button.classList.add('cateOn');
            });
        });

        // 프로젝트 필터링 함수
        function filterCertis(cate) {
            const certiCon = document.getElementById('certiCon');
            certiCon.innerHTML = '';
        
            const certiCate = cate === 'all'
                ? datas.certificate.sort((a, b) => b.no - a.no)
                : datas.certificate.filter(certificate => certificate.cate.toLowerCase() === cate).sort((a, b) => b.no - a.no);
            
            certiCate.forEach(certi => {
                const li = document.createElement('li');        
                li.innerHTML = `
                    <div class="top">
                        <p class="name">${certi.name}</p>
                        <p class="date">${certi.date}</p>
                    </div>
                    <p class="detail">${certi.detail}</p>
                    <p class="issuer">${certi.issuer}</p>
                    <i class="icon fa-solid ${certi.cate == "design" ? `fa-palette` : certi.cate == "OA" ? `fa-file-lines` : certi.catedetail == "eco" ? `fa-comments-dollar` : certi.catedetail == "car" ? "fa-car" : ""}"></i>
                `;
                certiCon.appendChild(li);
            });
        }
    
        // 초기 로딩 시 전체 프로젝트를 보여줌
        filterCertis('all');

        // --------------------------------------------------------------------------------------------------
        // 알림
        const alarmBtn = document.querySelector(".alarm");
        
        const today = new Date();
        const formatDay = today.toISOString().split('T')[0];

        const alarmCon = document.getElementById('alarmCon');
        const alarmShow = datas.update;
        
        const month1 = new Date();
        month1.setMonth(today.getMonth() - 1);

        alarmShow.forEach(alarm => {
            const ul = document.createElement('ul');
            ul.id = "alarmMain";
            const alarmHTML = [];
        
            if (!alarm.experience) {
                alarm.experience = formatDay;
            }
        
            if (alarm.profile && !isNaN(new Date(alarm.profile).getTime()) && new Date(alarm.profile) >= month1) {
                alarmHTML.push(`<li>프로필<span>${alarm.profile}</span></li>`);
            }
            if (alarm.experience && !isNaN(new Date(alarm.experience).getTime()) && new Date(alarm.experience) >= month1) {
                alarmHTML.push(`<li>경력<span>${alarm.experience}</span></li>`);
            }
            if (alarm.project && !isNaN(new Date(alarm.project).getTime()) && new Date(alarm.project) >= month1) {
                alarmHTML.push(`<li>프로젝트<span>${alarm.project}</span></li>`);
            }
            if (alarm.certificate && !isNaN(new Date(alarm.certificate).getTime()) && new Date(alarm.certificate) >= month1) {
                alarmHTML.push(`<li>자격증<span>${alarm.certificate}</span></li>`);
            }
            if (alarm.skill && !isNaN(new Date(alarm.skill).getTime()) && new Date(alarm.skill) >= month1) {
                alarmHTML.push(`<li>스킬<span>${alarm.skill}</span></li>`);
            }
        
            // 업데이트된 항목이 있을 경우 ul에 추가
            if (alarmHTML.length > 0) {
                alarmHTML.unshift(`<li class="title">업데이트 내역<span>(최근 1개월 이내)</span></li>`);
                ul.innerHTML = alarmHTML.join(''); // 배열을 HTML로 변환
                alarmCon.appendChild(ul); // ul을 alarmCon에 추가
                alarmBtn.classList.add("alarmOn");
            }
        });

        alarmBtn.addEventListener('click', () => {
            const alarmTool = document.getElementById("alarmMain");
            if(alarmTool.classList.contains('alarmOpen')){
                alarmTool.classList.remove('alarmOpen');
            } else{
                alarmTool.classList.add('alarmOpen');
            };
        });
    })
    .catch(error => {
        console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
    });

function detailOpen(event) {
    event.preventDefault();
    event.stopPropagation();
    const sectionDetails = document.querySelectorAll('.sectionDetail');
    const html = document.documentElement;
    const body = document.body;
    sectionDetails.forEach((section) => {
        section.classList.remove('detailOpen');
    });

    const targetId = event.target.id;
    console.log(targetId);

    if (!targetId || targetId.trim() === "") {
        console.error("유효하지 않은 클래스 이름입니다:", targetId);
        return;
    }

    const targetElement = document.querySelector(`.${targetId.trim()}`);

    if (targetElement) {
        targetElement.classList.add('detailOpen');
        html.classList.add('modalOpen');
        body.classList.add('modalOpen');
    } else {
        console.error(`Class가 '${targetId}'인 요소를 찾을 수 없습니다.`);
    }
};

function homeBtn(event) {
    event.preventDefault();
    event.stopPropagation();
    const sectionDetails = document.querySelectorAll('.sectionDetail');
    const html = document.documentElement;
    const body = document.body;

    sectionDetails.forEach((section) => {
        section.classList.remove('detailOpen');
    });
    html.classList.remove('modalOpen');
    body.classList.remove('modalOpen');
};