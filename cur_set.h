#ifndef CUR_SET_H
#define CUR_SET_H

#include <stdint.h>

#define CUR_SET_ADC_MAX   4095u
#define CUR_SET_MIN_A     0.3f
#define CUR_SET_MAX_A     22.0f

/* ADC(0~4095) 값을 22A 비선형(로그 테이퍼) 정격 전류값(A)으로 변환한다.
   pow/exp/log 등 수학 함수 없이 LUT + 선형 보간만 사용한다. */
float CurSet_AdcToCurrent(uint16_t adc);

#endif /* CUR_SET_H */
