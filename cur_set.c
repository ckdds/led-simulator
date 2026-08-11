#include "cur_set.h"

#define CUR_SET_LUT_POINTS      33u

#define CUR_SET_ACTIVE_MIN_ADC  171u
#define CUR_SET_ACTIVE_MAX_ADC  852u


static const uint16_t s_adcLut[CUR_SET_LUT_POINTS] =
{
    171, 192, 214, 235, 256, 277, 299, 320,
    341, 363, 384, 405, 426, 448, 469, 490,
    512, 533, 554, 575, 597, 618, 639, 660,
    682, 703, 724, 746, 767, 788, 809, 831,
    852
};


static const uint16_t s_currentLut_mA[CUR_SET_LUT_POINTS] =
{
      301,   343,   395,   450,   514,   587,   674,   769,
      878,  1008,  1151,  1314,  1499,  1722,  1966,  2244,
     2577,  2942,  3357,  3832,  4402,  5024,  5734,  6545,
     7518,  8581,  9794, 11250, 12840, 14656, 16728, 19214,
    21931
};


float CurSet_AdcToCurrent(uint16_t adc)
{
    uint16_t current_mA;

    if (adc > CUR_SET_ADC_MAX)
    {
        adc = CUR_SET_ADC_MAX;
    }

    /* 최소 전류 영역 */
    if (adc < CUR_SET_ACTIVE_MIN_ADC)
    {
        return CUR_SET_MIN_A;
    }

    /* 최대 전류 영역 */
    if (adc > CUR_SET_ACTIVE_MAX_ADC)
    {
        return CUR_SET_MAX_A;
    }

    /* LUT 구간 검색 및 선형 보간 */
    for (uint8_t i = 0u; i < (CUR_SET_LUT_POINTS - 1u); i++)
    {
        uint16_t x0 = s_adcLut[i];
        uint16_t x1 = s_adcLut[i + 1u];

        if ((adc >= x0) && (adc <= x1))
        {
            uint16_t y0 = s_currentLut_mA[i];
            uint16_t y1 = s_currentLut_mA[i + 1u];

            uint16_t dx = x1 - x0;
            uint16_t x  = adc - x0;

            uint32_t value =
                (uint32_t)(y1 - y0) * x;

            current_mA =
                y0 + (uint16_t)((value + (dx / 2u)) / dx);

            return (float)current_mA / 1000.0f;
        }
    }

    return CUR_SET_MAX_A;
}