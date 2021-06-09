---
layout: post
title:  "ConcurrentHashMap은 어떻게 thread-safe할 수 있는걸까?"
date:   2021-04-12 00:00:00
categories: JAVA
tags: JAVA concurrentHashMap
comments: 1
---
&nbsp;회사에서 종종 보이는 예외중의 하나가 동시성 관련 `ConcurrentModificationException`예외였다. 이 예외는 어떤 쓰레드가 Iterator를 통해 반복중인 Collection을 수정하는 경우 발생한다. 내가 본 경우는 DB에서 가져온 List를 순회하며 조건에 따라 수정하는 로직이었던 것으로 기억한다. 동시성 관련 예외는 멀티 스레드 환경에서 서로 다른 스레드가 같은 객체에 접근하여 데이터를 조작할 때에 발생한다. 아까 말한 List인 ArrayList의 경우 thread-safe하지 않기 때문에 동시성 이슈에서 자유로울 수 없었던 것이다.   
<br>


<strong>`ConcurrentHashMap`은 어떻게 thread-safe할 수 있는 걸까? </strong><br>
&nbsp;자바에서 제공하는 `HashMap`과 `Hashtable`은 Map인터페이스를 상속받아 구현되어 데이터를 키와 값으로 관리하는 자료구조이다.
이 둘의 차이점으로 동기화(Synchronization)를 들 수 있다. `HashMap`의 경우 동기화를 지원하지 않는다.
반면 다중 스레드 환경에서 `Hashtable`은 동기화를 지원하기 때문에 실행 환경에 따라 구분하여 사용하면 된다.   
&nbsp;동기화를 지원한다는 것은 스레드의 접근을 제한하여 단일 스레드만 순차적으로 접근할 수 있게 한다는 의미이다. 이것은 스레드의 병목을 유발하여 성능저하의 영향을 미칠 수 있다. 
동기화를 지원함으로 속도적인 측면에서 구형이라 할 수 있는 `Hashtable`은 동기화 처리라는 비용때문에 `HashMap`에 비해 더 느리다고 한다.
따라서 읽기가 많은 환경이라면 `HashMap`을 사용하는 것이 현명한 선택이라고 생각한다.   
<br>
&nbsp;이제 `concurrentHashMap`에 대해서 알아보자. `concurrentHashMap`은 동시적이고 멀티스레드한 환경에서 기존의 `hashmap`보다 더 나은 성능을 위해서 만들어졌다. `concurrenthashmap`은 동시성을 해결하기 위해 `hashtable`처럼 테이블 전체에 대해서 synchronize를 걸지 않는다. `hashtable`은 단일 스레드가 작업을 완료하는동안 전체 테이블에 락이 걸리게 되므로 성능적으로 손해를 본다.   

<br><br>
<div style="text-align:center;">
<img src="/../img/concurrentHashmap.jpg">
</div>
<br>
&nbsp;반면에, `concurrentHashMap`의 경우에는 전체 테이블에 락을 걸지 않고, 테이블을 여러 영역으로 나눈 후 작업이 일어나는 영역에만 락을 건다. 조금 더 자세히 말하자면 테이블을 concurrency의 level에 따라 여러 segment로 나눈 후, 작업이 일어나는 세그먼트에만 락을 거는 것이다.   
concurrency level이 특정되지 않는다면 concurrency level의 기본값은 16이다. 따라서 기본적으로 `concurrentHashMap`은 16개의 세그먼트로 분할되며, 각 세그먼트별로 작업할 수 있기 때문에 기본적으로 16개의 스레드가 동시에 접근하여 작업할 수 있다.   
&nbsp;위와 같은 원리로 `concurrencyHashmap`은 동시성을 보존함에도 thread-safe할 수 있으며, 성능적인 측면에서도 손해를 줄일 수 있다. 
하지만 put(), remove(), putAll(), clear() 등의 명령처럼 데이터를 수정하는 동기적으로 수행되기 때문에, map의 최신결과를 반영하지 않을 위험이 있다. 따라서 쓰기보다 읽기가 많을 경우에 적합하다.   
<br><br>
>참고 <br><https://www.geeksforgeeks.org/concurrenthashmap-in-java/><br><https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ConcurrentHashMap.html#ConcurrentHashMap-int-float-int-><br><https://dzone.com/articles/how-concurrenthashmap-works-internally-in-java><br><https://www.programmersought.com/article/51364737979/><br><https://odol87.tistory.com/3><br><https://www.programmersought.com/article/51364737979/>
