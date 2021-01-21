---
layout: post
title:  "equals () 및 hashcode ()로 객체 비교하기"
date:   2020-05-14 00:00:00
categories: JAVA
tags: JAVA
---
 * content
{:toc}


Q1.equals hashcode 차이
-  equals는 현재 객체와 넘겨진 객체를 비교한다. 
hashcode는 한 고유한 객체의 고유한 정수인 해시코드값을 반환한다. 
equals메소드에서 두 객체가 같다면 hashcode도 동일한 정수값이어야 한다.
equals () 및 hashcode () 메서드가 재정의되지 않으면 Object클래스에 정의된 메소드가 호출된다.
이 경우 메서드는 둘 이상의 객체가 동일한 값을 갖는지 확인하는 equals () 및 hashcode ()의 실제 목적을 충족하지 않습니다.
따라서 재정의는 꼭 필요하다. 