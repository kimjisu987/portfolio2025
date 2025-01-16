const gnb = document.querySelectorAll('.gnb > ul > li:not(#mode)');

gnb.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();

        let targetId = item.id;

        document.querySelectorAll('.sectionBottom').forEach(section => {
            section.style.display = 'none';
        });

        const targetElement = document.querySelector(`.${targetId}`);

        if (targetElement.classList.contains("mainBottom")) {
            targetElement.style.display = 'grid';
        } else {
            targetElement.style.display = 'block';
        }

        gnb.forEach(gnbItem => {
            gnbItem.classList.remove('gnbOn');
        });
        item.classList.add('gnbOn');
    });
});

const buttons = document.querySelectorAll('.sectionBottom button');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-section');
        const targetItem = document.querySelector(`#${targetId}`);
        targetItem.click();
    });
});


fetch('./data/kimjisu.json')
    .then(response => response.json())
    .then(datas => {

    // 카테고리 버튼 클릭 시 이벤트 처리
    document.querySelectorAll('.projectCate li').forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.target.textContent.toLowerCase(); // 버튼 텍스트로 카테고리 추출
            filterProjects(category);
            
            // 카테고리 버튼의 활성화 상태 처리
            document.querySelectorAll('.projectCate li').forEach(btn => btn.classList.remove('cateOn'));
            e.target.parentElement.classList.add('cateOn');
        });
    });

    // 프로젝트 필터링 함수
    function filterProjects(category) {
        const projectMainList = document.getElementById('projectMainList');
        projectMainList.innerHTML = ''; // 기존 프로젝트 리스트 비우기
        
        const filteredProjects = category === 'all' 
            ? datas.project.sort((a, b) => b.no - a.no)
            : datas.project.filter(project => project.cate === category).sort((a, b) => b.no - a.no); // 'ALL'이면 전체, 아니면 선택된 카테고리만
        
        filteredProjects.forEach(project => {
            const li = document.createElement('li');
            li.innerHTML = `
                <p class="projectContribution">${project.contribution}</p>
                <img src="./image/${project.img}" alt="${project.name}">
                <div>
                    <div class="projectText">
                        <p class="projectTitle">${project.name}</p>
                        <p class="projectDate">${project.startdate} ~ ${project.enddate}</p>
                        <p class="projectPosition">${project.position.join(', ')}</p>
                    </div>
                    <a href="${project.notion}" class="projectNotion" title="노션 제작 노트 연결" target="_blank">Notion</a>
                </div>                        
                <a href="${project.website}" class="projectLink" title="배포사이트 연결" target="_blank">Website</a>
            `;
            projectMainList.appendChild(li);
        });
    }

    // 초기 로딩 시 전체 프로젝트를 보여줌
    filterProjects('all');

        // 프로젝트
        const projectList = document.getElementById('projectList');
        const sortProject = datas.project.sort((a, b) => b.no - a.no);
        const showProject = sortProject.slice(0, 4);

        showProject.forEach(project => {
        const li = document.createElement('li');
        const skills = project.mainlang.map(lang => `<li>${lang}</li>`).join('');
        const positionMemos = project.positionMemo.map(memo => `<li class="my">${memo}</li>`).join('');

            li.innerHTML = `
                <p class="projectTitle">
                    ${project.name}
                    <span class="projectPosition">${project.position.join(', ')}</span>
                </p>
                <ul class="projectSkill">
                    ${skills}
                </ul>
                <div class="projectUser">
                    <ul>
                        ${positionMemos}
                    </ul>
                    <button type="button" class="toggle"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                    <div class="tooltip">
                        기여도 ${project.contribution}
                    </div>
                </div>
            `;
            projectList.appendChild(li);
        });

        // 스킬
        function renderSkillList(skillListElement, skillData, isMainList) {
            skillListElement.innerHTML = '';  // 기존 내용 비우기

            skillData.forEach(skill => {
                const li = document.createElement('li');
                
                // isMainList 값에 따른 처리
                if (isMainList === 1) {  // 메인 상단 리스트의 경우
                    li.innerHTML = `
                        <p class="skillLevel">
                            <span style="height:${skill.level}%">&nbsp;</span>
                            <p class="skillPer">${skill.level}%</p>
                        </p>
                        <p class="skillName">${skill.name}</p>
                    `;
                } else if (isMainList === 2) {  // 다른 메인 리스트의 경우
                    const categoryHtml = Array.isArray(skill.category)
                        ? skill.category.map(category => `<p class="skillCate">${category}</p>`).join('')  // category가 배열일 경우
                        : `<p class="skillCate">${skill.category}</p>`;  // category가 문자열일 경우

                    li.innerHTML = `
                        <div class="piecontainer"> 
                            <div class="piechart" style="background-image: conic-gradient(#FFDA74 calc(365 * 0.${skill.level}deg) , transparent 0)"></div>
                            <div class="piecover">&nbsp;</div>
                            <div class="skillName">${skill.name}</div>
                        </div>
                        <div class="cateContainer">
                            <p class="skillPer">${skill.level}%</p>
                            ${categoryHtml}
                        </div>
                    `;
                } else {  // 일반 리스트의 경우
                    li.innerHTML = `
                        <p class="skillLang">${skill.name}</p>
                        <p class="skillProgress"><span style="width:${skill.level}%"></span></p>
                        <p class="skillPercent">${skill.level}%</p>
                    `;
                }

                skillListElement.appendChild(li);
            });

            // 동적으로 생성된 .percentText 요소들에 대해 스타일 적용
            document.querySelectorAll('.percentText').forEach(function(percentText) {
                var data = percentText.getAttribute('data-percent');
                if (data !== null && !isNaN(data)) {
                    var heightValue = (parseFloat(data)) + "%";  // height 값 계산
                    var circleBox = percentText.closest('.circleBox');
                    if (circleBox) {
                        var water = circleBox.querySelector('.water');
                        if (water) {
                            water.style.height = heightValue;  // .water 요소의 높이를 설정
                        }
                    }
                }
            });
        }

        // 메인 상단 스킬
        const skillMainList = document.getElementById('skillMainList');
        if (skillMainList) {
            const sortSkillMain = datas.skill;
            renderSkillList(skillMainList, sortSkillMain, 1);  // 첫 번째 메인 리스트
        }

        // 메인 스킬
        const skillMainList2 = document.getElementById('skillMainList2');
        if (skillMainList2) {
            const sortSkillMain2 = datas.skill;
            renderSkillList(skillMainList2, sortSkillMain2, 2);  // 두 번째 메인 리스트
        }

        // 스킬 리스트
        const skillList = document.getElementById('skillList');
        if (skillList) {
            const sortSkill = datas.skill;
            renderSkillList(skillList, sortSkill, 3);  // 일반 리스트
        }

        // 공통 자격증 처리 함수
        function renderCertifiList(certifiListElement, certifiData, isMainList) {
            certifiListElement.innerHTML = '';  // 기존 리스트 비우기

            certifiData.forEach(certificate => {
                const li = document.createElement('li');

                if (isMainList) {
                    // 메인 리스트의 경우
                    const langHtml = Array.isArray(certificate.langs)
                        ? certificate.langs.map(langs => `<p class="skillCate">${langs}</p>`).join('')  // category가 배열일 경우
                        : `<p class="skillCate">${certificate.langs}</p>`;  // category가 문자열일 경우

                    li.innerHTML = `
                        <p class="icon"><i class="fa-solid fa-paste"></i></p>
                        <p class="certifiName">${certificate.name}</p>
                        <p class="certifiDate">${certificate.date}</p>
                        <p class="certifiIssuer">${certificate.issuer}</p>
                        <div class="certifiLangs">${langHtml}</div>
                    `;
                } else {
                    // 일반 리스트의 경우
                    li.innerHTML = `
                        <p class="certifiName">${certificate.name}</p>
                        <p class="certifiDate">${certificate.date}</p>
                    `;
                }
                // 일반 리스트일 때만 certifiHtml 추가
                certifiListElement.appendChild(li);
            });

            // 일반 리스트의 경우에만 <li class="listBack">&nbsp;</li> 추가
            if (!isMainList) {
                const certifiHtml = `<li class="listBack">&nbsp;</li>`;
                certifiListElement.innerHTML += certifiHtml;
            }
        }

        // 메인 자격증
        const certifiMainList = document.getElementById('certifiMainList');
        const sortCertifiMain = datas.certificate.sort((a, b) => b.no - a.no);
        renderCertifiList(certifiMainList, sortCertifiMain, true);  // 메인 리스트는 `true`를 전달

        // 자격증
        const certifiList = document.getElementById('certifiList');
        const sortCertifi = datas.certificate.sort((a, b) => b.no - a.no);  // 자격증을 no 기준으로 내림차순 정렬
        const showCertifi = sortCertifi.slice(0, 8);  // 최신 자격증 8개 가져오기
        renderCertifiList(certifiList, showCertifi, false);  // 일반 리스트는 `false`를 전달

        // 공통 경력 처리 함수
        function renderCareerList(careerListElement, careerData, isMainList) {
            careerListElement.innerHTML = '';  // 기존 리스트 비우기

            careerData.forEach(experience => {
                const li = document.createElement('li');

                // 경력 시작일과 종료일을 날짜 형식으로 변환
                const startDate = new Date(experience.startdate);
                const endDate = experience.enddate ? new Date(experience.enddate) : new Date();  // 종료일이 없는 경우 현재 날짜 - 재직중

                // 월 차이 계산 (재직 중인 경우 끝날 때까지의 차이)
                let months = ((endDate.getFullYear() - startDate.getFullYear()) * 12) + endDate.getMonth() - startDate.getMonth();

                // 년, 월로 분리
                const years = Math.floor(months / 12);
                const remainingMonths = months % 12 + 1;

                // 경력 기간을 '1년 1개월' 형식으로 표시
                const experienceDuration = `${years > 0 ? years + '년' : ''} ${remainingMonths > 0 ? remainingMonths + '개월' : ''}`.trim();

                // `careerMainList`와 `careerList` 각각의 다른 콘텐츠를 반영
                if (isMainList) {
                    // 메인 리스트의 경우
                    li.innerHTML = `
                        <div class="careerCompany">
                            <p class="careerTitle">${experience.company}</p>
                            <p class="careerDate">${experience.startdate} ~ ${experience.enddate || '재직중'} (${experienceDuration})</p>
                            <p class="careerPosition">${experience.position}</p>
                        </div>
                        <div class="careerMore">
                            <p class="careerDetail">${experience.detail}</p>
                        </div>
                        <img src="./image/${experience.logo}" alt="">
                    `;
                } else {
                    // 일반 리스트의 경우
                    li.innerHTML = `
                        <p class="careerMonths">${months < 10 ? '0' + months : months}</p>
                        <div>
                            <p class="careerCompany"><span class="company">${experience.company}</span><span class="position">${experience.position}</span></p>
                            <p class="careerDate">${experience.startdate} ~ ${experience.enddate || '재직중'}</p>
                        </div>
                        ${experience.relation === "1" ? `<p class="careerState">재직중</p>` : ''}
                    `;
                }

                careerListElement.appendChild(li);
            });
        }

        // 메인 경력
        const careerMainList = document.getElementById('careerMainList');
        const sortcareerMain = datas.experience.sort((a, b) => b.no - a.no);
        renderCareerList(careerMainList, sortcareerMain, true);  // 메인 리스트는 `true`를 전달

        // 경력
        const careerList = document.getElementById('careerList');
        const sortCareer = datas.experience.sort((a, b) => b.no - a.no);  // 경력도 no 기준으로 내림차순 정렬
        const showCareer = sortCareer.slice(0, 5);  // 최신 경력 5개 가져오기
        renderCareerList(careerList, showCareer, false);  // 일반 리스트는 `false`를 전달
    })
    .catch(error => {
        console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
    });

// 라이트/다크모드
document.addEventListener('DOMContentLoaded', function() {
    const switchInput = document.getElementById('modeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light'; // 기본값: light

    if (currentTheme == 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        switchInput.checked = true;
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        switchInput.checked = false;
    }

    // 토글 스위치 변경 시 테마 변경
    switchInput.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
});

// 툴팁 보이기/숨기기
let toggles = $(".toggle");
$(document).on("click", ".toggle", function(e){
    if ($(this).next(".tooltip").hasClass("active")) {
        $(this).next(".tooltip").removeClass("active").fadeOut();
    } else {
        $(".tooltip").hide().removeClass("active");
        $(this).next(".tooltip").addClass("active").fadeIn();
    }
    e.stopPropagation();
});

$(document).on("click", function(e) {
    if (!$(e.target).closest('.tooltip').length && !$(e.target).closest('.toggle').length) {
        $(".tooltip").removeClass("active").fadeOut();
    }
});

// 모바일 GNB 토글
$(document).on("click", ".gnbToggle", function() {
    if (!$(this).hasClass("gnbOn")) {
        $(this).addClass("gnbOn").next(".gnb").fadeIn();
    }
});
$(document).on("click", ".gnb", function() {
    if ($(".gnbToggle").css("display") !== "none") {
        $(".gnbToggle").removeClass("gnbOn");
        $(this).fadeOut();
    }
});