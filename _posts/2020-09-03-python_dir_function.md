---
layout: post
title:  "dir 함수"
date:   2020-09-03 00:00:01
categories: PYTHON
tags: PYTHON
comments : true
---
* content
{:toc}
  

## dir([object])

인자가 없으면, 현재 지역 스코프에 있는 이름들의 리스트를 돌려줍니다. 
인자가 있으면, 해당 객체에 유효한 어트리뷰트들의 리스트를 돌려주려고 시도합니다.
객체에 __dir__() 메서드가 있으면, 이 메서드가 호출되는데, 반드시 어트리뷰트 리스트를 돌려줘야 합니다. 이렇게 하면 커스텀 __getattr__() 또는 __getattribute__() 함수를 구현하는 객체가 dir() 이 어트리뷰트들을 보고하는 방법을 커스터마이즈할 수 있습니다.
객체가 __dir__() 을 제공하지 않으면, 함수는 (정의되었다면) 객체의 __ dict__ 어트리뷰트와 형 객체로부터 정보를 수집하기 위해 최선을 다합니다. 결과로 얻어지는 리스트는 반드시 완전하지는 않으며, 객체가 커스텀 __getattr__() 을 가질 때 부정확할 수도 있습니다.
기본 dir() 메커니즘은 다른 형의 객체에 대해서 다르게 동작하는데, 완전한 정보보다는 가장 적절한 정보를 만들려고 시도하기 때문입니다:
객체가 모듈 객체면, 리스트에는 모듈 어트리뷰트의 이름이 포함됩니다.
객체가 형 또는 클래스 객체면, 리스트에는 그것의 어트리뷰트 이름과 베이스의 어트리뷰트 이름들이 재귀적으로 포함됩니다.
그 밖의 경우, 리스트에는 객체의 어트리뷰트 이름, 해당 클래스의 어트리뷰트 이름 및 해당 클래스의 베이스 클래스들의 어트리뷰트 이름을 재귀적으로 포함합니다.
결과 리스트는 알파벳 순으로 정렬됩니다. 예를 들어:

```
import struct
dir()   # show the names in the module namespace  
['__builtins__', '__name__', 'struct']
dir(struct)   # show the names in the struct module 
['Struct', '__all__', '__builtins__', '__cached__', '__doc__', '__file__',
 '__initializing__', '__loader__', '__name__', '__package__',
 '_clearcache', 'calcsize', 'error', 'pack', 'pack_into',
 'unpack', 'unpack_from']
class Shape:
    def __dir__(self):
        return ['area', 'perimeter', 'location']
s = Shape()
dir(s)
```
>>>['area', 'location', 'perimeter']
참고 dir() 은 주로 대화형 프롬프트에서의 사용 편의를 위해 제공되기 때문에, 엄격하거나 일관되게 정의된 이름 집합을 제공하기보다 흥미로운 이름 집합을 제공하려고 시도하며, 상세한 동작은 배포마다 변경될 수 있습니다. 예를 들어, 인자가 클래스면 메타 클래스 어트리뷰트는 결과 리스트에 없습니다.