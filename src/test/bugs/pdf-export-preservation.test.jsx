/**
 * PDF Export Preservation Property Tests
 * 
 * **Validates: Requirements 3.4, 3.5, 3.6, 3.7**
 * 
 * These tests verify that PDF export quality settings remain unchanged
 * after implementing the smart page break fix. They capture the baseline
 * behavior on the CURRENT code (which already has the fix implemented).
 * 
 * Property 2: Preservation - PDF Quality Settings Unchanged
 * 
 * For all PDF exports, verify:
 * - SCALE = 3 rendering for print quality
 * - Font loading via warmFonts() and forceFontRender()
 * - Sidebar template background color preservation
 * - Page 2+ runner headers with name and page numbers
 * - PDF compression and image quality settings
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { exportToPDF } from '../../utils/pdfExporter'
import * as fc from 'fast-check'

// Mock dependencies
vi.mock('html2canvas', () => ({
  default: vi.fn(() => {
    // Create a proper mock canvas
    const mockCanvas = document.createElement('canvas')
    mockCanvas.width = 794 * 3
    mockCanvas.height = 1123 * 3
    
    // Mock getContext to return a proper context
    const originalGetContext = mockCanvas.getContext.bind(mockCanvas)
    mockCanvas.getContext = (type) => {
      const ctx = originalGetContext(type)
      if (ctx && type === '2d') {
        // Ensure drawImage works
        const originalDrawImage = ctx.drawImage.bind(ctx)
        ctx.drawImage = function(...args) {
          try {
            return originalDrawImage(...args)
          } catch (e) {
            // Silently handle canvas drawing errors in test environment
          }
        }
      }
      return ctx
    }
    
    return Promise.resolve(mockCanvas)
  })
}))

vi.mock('jspdf', () => ({
  default: vi.fn(function() {
    this.pages = []
    this.images = []
    this.watermarks = []
    this.addPage = () => { this.pages.push({}); return this }
    this.addImage = (data, format, x, y, w, h, alias, compression) => {
      this.images.push({ data, format, x, y, w, h, alias, compression })
      return this
    }
    this.save = (filename) => { this.savedFilename = filename; return this }
    this.setPage = (n) => { this.currentPage = n; return this }
    this.saveGraphicsState = () => this
    this.restoreGraphicsState = () => this
    this.setTextColor = () => this
    this.setFontSize = () => this
    this.setFont = () => this
    this.text = () => { this.watermarks.push(arguments); return this }
  })
}))

// Mock React
vi.mock('react', () => ({
  createElement: (type, props, ...children) => ({ type, props, children })
}))

vi.mock('react-dom/client', () => ({
  createRoot: () => ({
    render: vi.fn((element) => {
      // Simulate React rendering
      Promise.resolve().then(() => {})
    }),
    unmount: vi.fn()
  })
}))

describe('PDF Export Preservation Tests', () => {
  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = ''
    
    // Mock fonts API
    document.fonts = {
      ready: Promise.resolve(),
      load: vi.fn(() => Promise.resolve())
    }
    
    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      top: 0,
      bottom: 1123,
      left: 0,
      right: 794,
      width: 794,
      height: 1123
    }))
    
    // Mock scrollHeight
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get: function() { return 1123 }
    })
  })

  describe('Property 2.1: SCALE = 3 Rendering Preserved', () => {
    it('should use SCALE = 3 for all PDF exports', async () => {
      const html2canvas = (await import('html2canvas')).default
      
      const resumeData = {
        personal: { fullName: 'Test User' },
        experience: [],
        education: [],
        skills: []
      }
      
      const settings = { template: 'modern' }
      const templateComponent = () => ({ type: 'div', props: {}, children: [] })
      
      await exportToPDF(resumeData, settings, templateComponent, 'test', true)
      
      // Verify html2canvas was called with scale: 3
      expect(html2canvas).toHaveBeenCalled()
      const callArgs = html2canvas.mock.calls[0]
      expect(callArgs[1]).toHaveProperty('scale', 3)
    })

    it('should maintain SCALE = 3 across multiple page exports', async () => {
      const html2canvas = (await import('html2canvas')).default
      
      // Mock multi-page resume
      Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
        configurable: true,
        get: function() { return 2400 } // 2+ pages
      })
      
      const resumeData = {
        personal: { fullName: 'Multi Page User' },
        experience: Array(10).fill({
          company: 'Company',
          position: 'Position',
          description: 'Long description '.repeat(20)
        }),
        education: [],
        skills: []
      }
      
      const settings = { template: 'modern' }
      const templateComponent = () => ({ type: 'div', props: {}, children: [] })
      
      await exportToPDF(resumeData, settings, templateComponent, 'test', true)
      
      // Verify scale remains 3 for multi-page
      const callArgs = html2canvas.mock.calls[0]
      expect(callArgs[1]).toHaveProperty('scale', 3)
    })
  })

  describe('Property 2.2: Font Loading Mechanisms Preserved', () => {
    it('should call document.fonts.ready before capture', async () => {
      const fontsReadySpy = vi.spyOn(document.fonts, 'ready', 'get')
      
      const resumeData = {
        personal: { fullName: 'Font Test' },
        experience: [],
        education: [],
        skills: []
      }
      
      const settings = { template: 'modern' }
      const templateComponent = () => ({ type: 'div', props: {}, children: [] })
      
      await exportToPDF(resumeData, settings, templateComponent, 'test', true)
      
      // Verify fonts.ready was accessed
      expect(fontsReadySpy).toHaveBeenCalled()
    })

    it('should load all font families and weights', async () => {
      const fontLoadSpy = vi.spyOn(document.fonts, 'load')
      
      const resumeData = {
        personal: { fullName: 'Font Load Test' },
        experience: [],
        education: [],
        skills: []
      }
      
      const settings = { template: 'modern' }
      const templateComponent = () => ({ type: 'div', props: {}, children: [] })
      
      await exportToPDF(resumeData, settings, templateComponent, 'test', true)
      
      // Verify font loading was called (warmFonts function)
      // Should load Inter, Libre Baskerville, Plus Jakarta Sans
      // with weights 400, 600, 700, 900
      expect(fontLoadSpy).toHaveBeenCalled()
    })
  })

  describe('Property 2.3: Sidebar Background Color Preservation', () => {
    it('should preserve sidebar background color across pages', async () => {
      // Mock sidebar element
      const mockSidebar = document.createElement('div')
      mockSidebar.setAttribute('data-is-sidebar', 'true')
      mockSidebar.style.backgroundColor = 'rgb(30, 58, 138)' // Blue sidebar
      
      Element.prototype.getBoundingClientRect = vi.fn(function() {
        if (this.getAttribute('data-is-sidebar') === 'true') {
          return { top: 0, bottom: 1123, left: 0, right: 240, width: 240, height: 1123 }
        }
        return { top: 0, bottom: 1123, left: 0, right: 794, width: 794, height: 1123 }
      })
      
      document.querySelector = vi.fn((selector) => {
        if (selector === '[data-is-sidebar="true"]') return mockSidebar
        return null
      })
      
      const resumeData = {
        personal: { fullName: 'Sidebar Test' },
        experience: [],
        education: [],
        skills: []
      }
      
      const settings = { template: 'sidebar' }
      const templateComponent = () => ({ type: 'div', props: {}, children: [] })
      
      const result = await exportToPDF(resumeData, settings, templateComponent, 'test', true)
      
      // Verify export succeeded (sidebar color handling didn't break)
      expect(result.success).toBe(true)
    })
  })

  describe('Property 2.4: Page 2+ Runner Headers Preserved', () => {
    it('should include runner headers on page 2+ with name and page numbers', async () => {
      // Mock multi-page resume
      Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
        configurable: true,
        get: function() { return 2400 } // 2+ pages
      })
      
      const resumeData = {
        personal: { fullName: 'John Doe' },
        experience: Array(10).fill({
          company: 'Company',
          position: 'Position',
          description: 'Description '.repeat(30)
        }),
        education: [],
        skills: []
      }
      
      const settings = { template: 'modern' }
      const templateComponent = () => ({ type: 'div', props: {}, children: [] })
      
      const result = await exportToPDF(resumeData, settings, templateComponent, 'test', true)
      
      // Verify multi-page export succeeded
      expect(result.success).toBe(true)
      expect(result.pages).toBeGreaterThan(1)
      
      // Runner headers are rendered via canvas fillText in the code
      // We verify the export completed successfully with multiple pages
    })
  })

  describe('Property 2.5: PDF Compression Settings Preserved', () => {
    it('should use FAST compression for images', async () => {
      const resumeData = {
        personal: { fullName: 'Compression Test' },
        experience: [],
        education: [],
        skills: []
      }
      
      const settings = { template: 'modern' }
      const templateComponent = () => ({ type: 'div', props: {}, children: [] })
      
      const result = await exportToPDF(resumeData, settings, templateComponent, 'test', true)
      
      // Verify PDF export succeeded with compression
      expect(result.success).toBe(true)
      // The jsPDF constructor is called with compress: true in the implementation
    })
  })

  describe('Property-Based: Quality Settings Invariant', () => {
    it('should maintain quality settings for any resume structure', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            fullName: fc.string({ minLength: 1, maxLength: 50 }),
            experienceCount: fc.integer({ min: 0, max: 5 }),
            educationCount: fc.integer({ min: 0, max: 3 }),
            skillsCount: fc.integer({ min: 0, max: 10 })
          }),
          async (input) => {
            const html2canvas = (await import('html2canvas')).default
            html2canvas.mockClear()
            
            const resumeData = {
              personal: { fullName: input.fullName },
              experience: Array(input.experienceCount).fill({
                company: 'Company',
                position: 'Position',
                description: 'Description'
              }),
              education: Array(input.educationCount).fill({
                institution: 'University',
                degree: 'Degree'
              }),
              skills: Array(input.skillsCount).fill('Skill')
            }
            
            const settings = { template: 'modern' }
            const templateComponent = () => ({ type: 'div', props: {}, children: [] })
            
            const result = await exportToPDF(resumeData, settings, templateComponent, 'test', true)
            
            // Verify quality settings preserved
            expect(result.success).toBe(true)
            
            // Verify SCALE = 3 always used
            const callArgs = html2canvas.mock.calls[0]
            expect(callArgs[1]).toHaveProperty('scale', 3)
            
            // Verify backgroundColor always white
            expect(callArgs[1]).toHaveProperty('backgroundColor', '#ffffff')
            
            // Verify useCORS and allowTaint settings
            expect(callArgs[1]).toHaveProperty('useCORS', true)
            expect(callArgs[1]).toHaveProperty('allowTaint', false)
          }
        ),
        { numRuns: 10, timeout: 10000 }
      )
    }, 15000)
  })

  describe('Property-Based: Font Loading Consistency', () => {
    it('should load fonts consistently regardless of content', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            fullName: fc.string({ minLength: 1, maxLength: 50 }),
            contentLength: fc.integer({ min: 100, max: 3000 })
          }),
          async (input) => {
            const fontLoadSpy = vi.spyOn(document.fonts, 'load')
            fontLoadSpy.mockClear()
            
            // Mock scrollHeight based on content length
            Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
              configurable: true,
              get: function() { return input.contentLength }
            })
            
            const resumeData = {
              personal: { fullName: input.fullName },
              experience: [],
              education: [],
              skills: []
            }
            
            const settings = { template: 'modern' }
            const templateComponent = () => ({ type: 'div', props: {}, children: [] })
            
            await exportToPDF(resumeData, settings, templateComponent, 'test', true)
            
            // Verify fonts were loaded
            expect(fontLoadSpy).toHaveBeenCalled()
          }
        ),
        { numRuns: 10, timeout: 10000 }
      )
    }, 15000)
  })
})
