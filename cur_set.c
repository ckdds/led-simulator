#include "cur_set.h"

#define CUR_SET_LUT_POINTS      33u

#define CUR_SET_ACTIVE_MIN_ADC  683u
#define CUR_SET_ACTIVE_MAX_ADC  3413u


static const uint16_t s_adcLut[CUR_SET_LUT_POINTS] =
{
     683,  768,  853,  938, 1024, 1109, 1194, 1280,
    1365, 1450, 1536, 1621, 1706, 1792, 1877, 1962,
    2048, 2133, 2218, 2303, 2389, 2474, 2559, 2645,
    2730, 2815, 2901, 2986, 3071, 3157, 3242, 3327,
    3413
};


static const uint16_t s_currentLut_mA[CUR_SET_LUT_POINTS] =
{
      300,   343,   392,   449,   513,   587,   671,   768,
      878,  1004,  1148,  1313,  1502,  1718,  1964,  2246,
     2569,  2938,  3360,  3843,  4395,  5026,  5748,  6574,
     7518,  8598,  9833, 11245, 12861, 14708, 16821, 19237,
    22000
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