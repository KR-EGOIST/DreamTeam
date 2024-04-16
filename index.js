// Firebase SDK 라이브러리 가져오기
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import {
  getDocs,
  collection,
  addDoc,
  doc,
  deleteDoc,
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
  let comment = $('#comment').val();

  if (!image || !name || !MBTI || !comment) {
    // 값을 입력하지 않으면
    alert('정보를 입력하세요!');
  } else {
    let doc = {
      image: image,
      name: name,
      position: position,
      MBTI: MBTI,
      comment: comment,
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
  let comment = row['comment'];

  let temp_html = `
  <div class="col">
  <div class="card">
    <img src="${image}" class="card-img-top" alt="..." />
    <div class="card-body">
      <h5 class="card-name">${name} <span class="card-position" style="font-size: medium;">${position}</span></h5>
      <p class="card-MBTI">${MBTI}</p>
      <p class="card-comment">${comment}</p>
      <div class="card-btn">
        <button value="${id}" class="edit-btn">수정</button>
        <button value="${id}" class="delete-btn">삭제</button>
      </div>
    </div>
  </div>
</div>`;
  $('#card').append(temp_html);
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
btnOpenPopups.forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.getAttribute('data-modal-target'));
    modal.classList.toggle('show');

    if (modal.classList.contains('show')) {
      body.style.overflow = 'hidden';
    }
  });
});

// 모든 모달에 대해 클릭 이벤트 리스너 추가
modals.forEach(modal => {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.remove('show');
      
      if (!document.querySelector('.modal.show')) {
        body.style.overflow = 'auto';
      }
    }
  });
});