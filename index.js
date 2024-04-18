// Firebase SDK 라이브러리 가져오기
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import {
  getDocs,
  getDoc,
  collection,
  addDoc,
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// Firebase 구성 정보 설정
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBKiu3vfUnvjHx5_M4XD25B6hY26LNPfEw',
  authDomain: 'sparta-77b4a.firebaseapp.com',
  projectId: 'sparta-77b4a',
  storageBucket: 'sparta-77b4a.appspot.com',
  messagingSenderId: '541201543394',
  appId: '1:541201543394:web:0913c44614cba2b523eebb',
  measurementId: 'G-97BRQ5KXHR',
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 기존 카드 내용 지우기
$('#card').empty();

// 포스팅 박스 토글 (사라졌다 생겼다)
$('.toggle-btn').click(async function () {
  $('#postingbox').toggle();
});

// 추가 기능
$('#save-btn').click(async function () {
  let image = $('#image').val();
  let name = $('#name').val();
  let position = $('#position').val();
  let MBTI = $('#MBTI').val();
  let my_Blog = $('#my_Blog').val();
  let my_Github = $('#my_Github').val();
  let comment = $('#comment').val();
  let advantage = $('#advantage').val();
  let my_style = $('#my_style').val();

  if (
    !image ||
    !name ||
    !MBTI ||
    !comment ||
    !advantage ||
    !my_style ||
    !my_Blog ||
    !my_Github
  ) {
    // 값을 입력하지 않으면
    alert('정보를 입력하세요!');
  } else {
    let doc = {
      image: image,
      name: name,
      position: position,
      MBTI: MBTI,
      my_Blog: my_Blog,
      my_Github: my_Github,
      comment: comment,
      advantage: advantage,
      my_style: my_style,
    };

    await addDoc(collection(db, 'DreamTeam'), doc);
    alert('팀원이 추가되었습니다!');
    window.location.reload();
  }
});

// 데이터 가져오기
let docs = await getDocs(collection(db, 'DreamTeam'));
docs.forEach((doc) => {
  let row = doc.data();
  let id = doc.id;

  let image = row['image'];
  let name = row['name'];
  let position = row['position'];
  let MBTI = row['MBTI'];
  let my_Blog = row['my_Blog'];
  let my_Github = row['my_Github'];
  let comment = row['comment'];
  let advantage = row['advantage'];
  let my_style = row['my_style'];

  let temp_html = `
  <div class="col">
  <div class="card">
    <img src="${image}" class="card-img-top" alt="..." />
    <div class="card-body">
      <h5 class="card-name">${name} <span class="card-position" style="font-size: medium;">${position}</span></h5>
      <p class="card-MBTI">${MBTI}</p>
      <p class="card-comment">${comment}</p>
      <div class="card-btn">
        <button value="${id}" class="edit-btn" data-bs-toggle="modal" data-bs-target="#updateModal">수정</button>
        <button value="${id}" class="delete-btn">삭제</button>
      </div>
    </div>
  </div>
</div>`;

  $('#card').append(temp_html);

  // 모달창 데이터 가져오기
  for (let i = 0; i < 6; i++) {
    let modal_btn = document.getElementById(`modal_btn${i}`);
    if (name == modal_btn.parentElement.parentElement.children[0].textContent) {
      modal_btn.value = `${id}`;
      console.log(modal_btn.value);
      let modal_html = `
        <div id="modal_top">
          <img src="${image}" width="100px" height="150px" alt="..." />
          <div div id="modal_top_right">
            <div id="modal_nametag">
              <h3>${name}</h3>
              <h5>${position}</h5>
            </div>
            <p>${comment}</p>
            <br>
            <h5>MBTI : ${MBTI}</h5>
            <h5>Blog url : <a href="${my_Blog}"
              target="_blank" style="text-decoration-line: none;">${my_Blog}</a></h5>
            <h5>Github url : <a href="${my_Github}"
              target="_blank" style="text-decoration-line: none;">${my_Github}</a></h5>
          </div>
        </div>
        <br>
        <div id="modal_bottom">
          <p>객관적으로 살펴본 자신의 강점</p>
          <hr>
          <p>${advantage}</p>
          <br>
          <p>자신의 스타일 / 협업 스타일</p>
          <hr>
          <p>${my_style}</p>
        </div>`;
      $(`.modal_num${i}`).append(modal_html);
    } else {
      continue;
    }
  }
});

// 삭제 기능
// this 는 추가기능에서 삭제 버튼에 value 값을 저장할 것입니다.
$('.delete-btn').click(async function () {
  console.log(this.value);
  if (confirm('정말 삭제하시겠습니까?') == true) {
    await deleteDoc(doc(db, 'DreamTeam', this.value));

    window.location.reload();
  } else {
    return false;
  }
});

// 모달창
const body = document.querySelector('body');
const modals = document.querySelectorAll('.modal');
const btnOpenPopups = document.querySelectorAll('.btn-open-popup');

// 각 버튼에 대해 클릭 이벤트 리스너 추가
btnOpenPopups.forEach((button) => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(
      button.getAttribute('data-modal-target')
    );

    modal.classList.toggle('show');

    if (modal.classList.contains('show')) {
      body.style.overflow = 'hidden';
    }
  });
});

// 모든 모달에 대해 클릭 이벤트 리스너 추가
modals.forEach((modal) => {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.remove('show');

      if (!document.querySelector('.modal.show')) {
        body.style.overflow = 'auto';
      }
    }
  });
});

// 대상 지정용 ID정보
let tar_id;
// 수정 버튼 클릭시 모달창 팝업
$('.edit-btn').click(async function () {
  tar_id = this.value;
  console.log(tar_id);

  let tar_doc = doc(db, 'DreamTeam', tar_id);
  let rcv_Doc = await getDoc(tar_doc);
  let tar_data = rcv_Doc.data();

  let image = tar_data.image;
  let name = tar_data.name;
  let position = tar_data.position;
  let MBTI = tar_data.MBTI;
  let comment = tar_data.comment;

  /* 데이터 확인용
  console.log(image);
  console.log(name);
  console.log(position);
  console.log(MBTI);
  console.log(comment);
  */

  $('#updateModalLabel').text('수정 대상: ' + name);
});

// HTML 문서의 로딩이 완료되었을 때, 해당 함수를 실행
document.addEventListener('DOMContentLoaded', function () {
  // elements
  var modalBtn = document.getElementById('modalBtn');
  var modal = document.getElementById('myModal');
  var closeBtn = document.getElementById('closeBtn');

  // functions
  function toggleModal() {
    modal.classList.toggle('show');
  }

  // events
  modalBtn.addEventListener('click', toggleModal);
  closeBtn.addEventListener('click', toggleModal);

  window.addEventListener('click', function (event) {
    // 모달의 검은색 배경 부분이 클릭된 경우 닫히도록 하는 코드
    if (event.target === modal) {
      toggleModal();
    }
  });
});

/* 수정완료 버튼 클릭시 Update 실행 */
$('#confirm-btn').click(async function () {
  let image = $('#update_image').val();
  let name = $('#update_name').val();
  let position = $('#update_position').val();
  let MBTI = $('#update_MBTI').val();
  let my_Blog = $('#update_my_Blog').val();
  let my_Github = $('#update_my_Github').val();
  let comment = $('#update_comment').val();
  let advantage = $('#update_advantage').val();
  let my_style = $('#update_my_style').val();

  if (!image || !name || !MBTI || !comment || !advantage || !my_style) {
    // 값을 입력하지 않으면
    alert('빈칸은 불가능합니다.');
  } else {
    /* 맨위의 참조선언의 doc와 이름이 겹침 -> doc_input으로 변경함 */
    let doc_input = {
      image: image,
      name: name,
      position: position,
      MBTI: MBTI,
      my_Blog: my_Blog,
      my_Github: my_Github,
      comment: comment,
      advantage: advantage,
      my_style: my_style,
    };

    /* 수정직전 데이터 확인 */
    console.log(image);
    console.log(name);
    console.log(position);
    console.log(MBTI);
    console.log(my_Blog);
    console.log(my_Github);
    console.log(comment);
    console.log(advantage);
    console.log(my_style);

    let target = doc(db, 'DreamTeam', tar_id);
    await setDoc(target, doc_input);
    alert('수정되었습니다.');

    $('#updateModal').modal('hide');
    window.location.reload();
  }
});
