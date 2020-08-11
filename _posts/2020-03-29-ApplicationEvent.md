---
layout: post
title:  "ApplicationEvent 사용하기"
date:   2020-04-04 00:00:08
categories: SPRING
tags: MessageSource SPRING
---

* content
{:toc}

# ApplicationEvent 사용하기

스프링은 애플리케이션 컨텍스트는 이벤트를 기반으로 빈 사이의 상호작용을 지원한다.

- 이벤트는 java.util.EventObject를 상속한 ApplicationEvent에서 파생된 클래스다. 
- ApplicationContext가 구성될 때 ApplicationListener<T> 인터페이스를 구현한 빈을 자동으로 리스너로 등록하기 때문에, 모든 빈은 ApplicationListener<T> 인터페이스를 구현해 이벤트를 받을 수 있다.
- 이벤트는 ApplicationEventPublisher.publishEvent() 메서드로 발행하며 ApplicationContext가 ApplicationEventPublisher 인터페이스를 상속하므로 이벤트를 발행하는 클래스는 반드시 ApplicationContext에 접근할 수 있어야 한다. 
- 웹 어플리케이션에서는 간단히 ApplicationContext에 접근할 수 있다.
- 이에 비해 독립형 애플리케이션에서는 이벤트 발행 빈이 ApplicationContextAware를 구현하면 이벤트를 발행할 수 있다.



